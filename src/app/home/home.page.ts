import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WeatherComponent } from '../weather/weather.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, WeatherComponent],
})
export class HomePage {
  constructor() {}
}
