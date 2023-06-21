import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WeatherService, Forecast } from '../api/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class WeatherComponent implements OnInit {
  language = 'sl-SI';
  dateFormat?: string;
  weatherData?: Forecast;
  lastUpdated?: Date;

  private latitude = '46.5535';
  private longitude = '15.6445';

  constructor(
    private weatherService: WeatherService,
    private translate: TranslateService
  ) {
    translate.get('dateFormat').subscribe((value) => {
      this.dateFormat = value;
    });
    translate.onLangChange.subscribe((event) => {
      translate.get('dateFormat').subscribe((value) => {
        this.dateFormat = value;
      });
      this.getWeatherData();
      this.language = event.lang === 'sl' ? 'sl-SI' : 'en-UK';
    });
  }

  ngOnInit() {
    this.getWeatherData();
  }

  getWeatherData() {
    this.weatherData = undefined;
    this.weatherService
      .getForecast(this.latitude, this.longitude, this.translate.currentLang)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.weatherData = data;
          this.lastUpdated = new Date();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
