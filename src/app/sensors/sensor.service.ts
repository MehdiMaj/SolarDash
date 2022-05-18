import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Sensor } from './sensor.model';

@Injectable({ providedIn: 'root' })
export class SensorService {
  private sensors: Sensor[] = [];
  private sensorsUpdated = new Subject<{
    sensors: Sensor[];
    sensorsCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}
  addSensor(ID: string, zone: string) {
    const formData = new FormData();
    formData.append('sensorId', ID);
    formData.append('Zone', zone);
    this.http
      .post<{ message: string; sensor: Sensor }>(
        'http://localhost:9000/api/v1/sensors/',
        { zone: formData.get('Zone'), sensorId: formData.get('sensorId') }
      )
      .subscribe((responseData) => {
        //this.router.navigate(['dashboard/list-sensors']);
      });
  }
  getSensorUpdateListener() {
    return this.sensorsUpdated.asObservable();
  }
  getSensorByZone(
    zone: string | null,
    dateStart: number,
    dateEnd: number,
    selectedFilter: string,
    type: string
  ) {
    this.http
      .get<{ status: string; data: any; results: number }>(
        'http://localhost:9000/api/v1/sensors/SensorByZoneAndDate/' +
          zone +
          '?' +
          'dateStart' +
          '=' +
          dateStart +
          '&dateEnd=' +
          dateEnd +
          '&filter=' +
          selectedFilter +
          '&type=' +
          type
      )
      .pipe(
        map((sensorData) => {
          console.log(sensorData);
          return {
            sensors: sensorData.data.map((sensor) => {
              console.log(sensor);
              return sensor;
            }),
            maxSensors: sensorData.results,
          };
        })
      )
      .subscribe((transformedSensorsData) => {
        this.sensors = transformedSensorsData.sensors;
        this.sensorsUpdated.next({
          sensors: [...this.sensors],
          sensorsCount: transformedSensorsData.maxSensors,
        });
      });
  }
  async getFiltredSensor(
    zone: string | null,
    dateStart: number,
    dateEnd: number,
    selectedFilter: string,
    type: string
  ) {
    const data = await this.http
      .get<{ status: string; data: any; results: number }>(
        'http://localhost:9000/api/v1/sensors/SensorByZoneAndDate/' +
          zone +
          '?' +
          'dateStart' +
          '=' +
          dateStart +
          '&dateEnd=' +
          dateEnd +
          '&filter=' +
          selectedFilter +
          '&type=' +
          type
      )
      .toPromise();
    return data;
  }
}
