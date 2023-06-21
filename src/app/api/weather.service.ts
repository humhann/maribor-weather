import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export type Forecast = {
  city: string;
  lastUpdated: Date;
  conditions: {
    temperature: {
      current: number;
      min: number;
      max: number;
    };
    pressure: number;
    humidity: number;
    description: string;
    icon: string;
  };
  forecast: {
    date: Date;
    hourly: {
      temperature: number;
      description: string;
      icon: string;
    }[];
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly forecastUrl = `${this.baseUrl}/forecast`;

  constructor(private http: HttpClient) {}

  public getForecast(
    latitude: string,
    longitude: string,
    language: string,
    forceRemote = false
  ): Observable<Forecast> {
    return new Observable((observer) => {
      if (!forceRemote) {
        const initialData = this.getForecastLocal(
          latitude,
          longitude,
          language
        );

        if (initialData) {
          observer.next(initialData);
        }
      }

      this.getForecastRemote(latitude, longitude, language).subscribe({
        next: (data) => {
          observer.next(data);
          this.storeForecastLocal(latitude, longitude, language, data);
        },
        complete: () => {
          observer.complete();
        },
      });
    });
  }

  private getForecastLocal(
    latitude: string,
    longitude: string,
    language: string
  ): Forecast | null {
    const key = this.getForecastLocalKey(latitude, longitude, language);
    try {
      return JSON.parse(localStorage.getItem(key) || '');
    } catch (error) {}

    return null;
  }

  private storeForecastLocal(
    latitude: string,
    longitude: string,
    language: string,
    data: Forecast
  ): void {
    const key = this.getForecastLocalKey(latitude, longitude, language);

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {}
  }

  private getForecastLocalKey(
    latitude: string,
    longitude: string,
    language: string
  ): string {
    return `forecast-${latitude}-${longitude}-${language}`;
  }

  private getForecastRemote(
    latitude: string,
    longitude: string,
    language: string
  ): Observable<Forecast> {
    return this.http
      .get<any>(
        `${this.forecastUrl}?lat=${latitude}&lon=${longitude}&appid=${environment.weatherApiKey}&units=metric&lang=${language}`
      )
      .pipe(
        map((response) => ({
          city: response.city.name,
          lastUpdated: new Date(),
          conditions: {
            temperature: {
              current: this.roundTemperature(response.list[0].main.temp),
              min: this.roundTemperature(response.list[0].main.temp_min),
              max: this.roundTemperature(response.list[0].main.temp_max),
            },
            pressure: response.list[0].main.pressure,
            humidity: response.list[0].main.humidity,
            description: response.list[0].weather[0].description,
            icon: this.getIconUrl(response.list[0].weather[0].icon),
          },
          forecast: response.list
            // filter days that are not today
            .filter(
              (item: any) =>
                !new Date(item.dt_txt)
                  .toDateString()
                  .includes(new Date().toDateString())
            )
            // filter items of hours 6:00, 12:00 and 18:00
            .filter((item: any) => {
              const date = new Date(item.dt_txt);
              return (
                date.getHours() === 6 ||
                date.getHours() === 12 ||
                date.getHours() === 18
              );
            })
            // group items by day
            .reduce((acc: any, item: any) => {
              const date = new Date(item.dt_txt);
              const dateString = date.toDateString();
              let dateIndex = acc.findIndex(
                (accItem: any) => accItem.date.toDateString() === dateString
              );

              if (dateIndex === -1) {
                acc.push({
                  date: date,
                  hourly: [],
                });
                dateIndex = acc.length - 1;
              }

              acc[dateIndex].hourly.push({
                temperature: this.roundTemperature(item.main.temp),
                description: item.weather[0].description,
                icon: this.getIconUrl(item.weather[0].icon),
              });
              return acc;
            }, []),
        }))
      );
  }

  private roundTemperature(temperature: number): number {
    return Math.round(temperature);
  }

  private getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
