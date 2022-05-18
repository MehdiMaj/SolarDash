import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherData(location) {
    return this.http.get(
      `${environment.apiUrl}/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=hourly,minutely&units=metric&appid=06b2d310659c1a2c396d62af67323da8`
    );
  }
}
