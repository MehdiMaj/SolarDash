import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Zone } from './zone.model';

@Injectable({ providedIn: 'root' })
export class ZonesService {
  private zones: Zone[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  addZone(name: string, site: string) {
    const formData = new FormData();
    formData.append('name', name);
    this.http
      .post<{ status: string; data: Zone }>(
        'http://localhost:9000/api/v1/sites/' + site + '/zones',
        { name: formData.get('name') }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }
}
