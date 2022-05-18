import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnChanges, OnDestroy {
  @Input() location;
  dataWeather = {};
  dailyWeather = [];
  weatherIcon: string;

  constructor(public serviceWeather: WeatherService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.serviceWeather.getWeatherData(this.location).subscribe((data) => {
      this.dataWeather = data;
      console.log(this.dataWeather);
      this.dataWeather['daily'].pop();
      this.dailyWeather = this.dataWeather['daily'];

      this.weatherIcon = `http://openweathermap.org/img/wn/${this.dailyWeather['icon']}@2x.png`;
    });
  }
  ngOnDestroy(): void {}
}
