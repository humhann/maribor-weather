import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WeatherService, Forecast } from '../api/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class WeatherComponent implements OnInit {
  dateFormat = "dd.MM.yyyy 'ob' HH:mm:ss";
  weatherData?: Forecast;
  lastUpdated?: Date;

  private latitude = '46.5535';
  private longitude = '15.6445';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getWeatherData();
  }

  getWeatherData() {
    this.weatherService.getForecast(this.latitude, this.longitude).subscribe({
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
