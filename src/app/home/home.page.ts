import { Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WeatherComponent } from '../weather/weather.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, WeatherComponent, TranslateModule],
})
export class HomePage {
  @ViewChild(WeatherComponent) weatherComponent!: WeatherComponent;

  constructor(private translate: TranslateService) {
    this.translate.use('sl');
  }

  getWeather() {
    this.weatherComponent.getWeatherData(true);
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
  }
}
