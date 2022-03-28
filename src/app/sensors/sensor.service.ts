import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Sensor } from './sensor.model';

@Injectable({ providedIn: 'root' })
export class SensorService {
  private sensors: Sensor[] = [];
  private sensorsUpdated = new Subject<{
    sites: Sensor[];
    siteCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}
  addSensor(ID: string, zone: string) {
    const formData = new FormData();
    formData.append('Zone', zone);
    this.http
      .patch<{ message: string; site: Sensor }>(
        'http://localhost:9000/api/v1/sensors/' + ID,
        { zone: formData.get('Zone') }
      )
      .subscribe((responseData) => {
        //this.router.navigate(['dashboard/list-sensors']);
      });
  }
}