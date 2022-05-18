import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { Zone } from './zone.model';

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private zones: Zone[];
  private zonesUpdated = new Subject<{ zones: Zone[]; zoneCount: number }>();
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
        this.router.navigate(['/dashboard/list-zones']);
      });
  }
  getZoneUpdateListener() {
    return this.zonesUpdated.asObservable();
  }
  getZones() {
    this.http
      .get<{ status: string; data: any; results: number }>(
        'http://localhost:9000/api/v1/zones/my-zones'
      )
      .pipe(
        map((zoneData) => {
          return {
            zones: zoneData.data.map((zone) => {
              return {
                name: zone.name,
                site: {
                  site_name: zone.site.name,
                  site_description: zone.site.description,
                },
                id: zone._id,
                createdAt: zone.createdAt,
              };
            }),
            maxZones: zoneData.results,
          };
        })
      )
      .subscribe((transformedSiteData) => {
        this.zones = transformedSiteData.zones;
        this.zonesUpdated.next({
          zones: [...this.zones],
          zoneCount: transformedSiteData.maxZones,
        });
      });
  }
  getZonesBySite(site: string) {
    this.http
      .get<{ status: string; data: any; results: number }>(
        'http://localhost:9000/api/v1/sites/' + site + '/zones'
      )
      .pipe(
        map((zoneData) => {
          return {
            zones: zoneData.data.map((zone) => {
              return {
                name: zone.name,
                site: {
                  site_name: zone.site.name,
                  site_description: zone.site.description,
                },
                id: zone._id,
                createdAt: zone.createdAt,
              };
            }),
            maxZones: zoneData.results,
          };
        })
      )
      .subscribe((transformedSiteData) => {
        this.zones = transformedSiteData.zones;
        this.zonesUpdated.next({
          zones: [...this.zones],
          zoneCount: transformedSiteData.maxZones,
        });
      });
  }

  getZone(id: string) {
    return this.http.get<{ status: string; data: any }>(
      'http://localhost:9000/api/v1/zones/' + id
    );
  }

  deleteZone(zoneId: string) {
    console.log(zoneId);
    return this.http.delete('http://localhost:9000/api/v1/zones/' + zoneId);
  }

  updateZone(id: string, name: string, site: string, createdAt: Date) {
    const postData: Zone = {
      id: id,
      name: name,
      site: site,
      createdAt: createdAt,
    };

    this.http
      .patch('http://localhost:9000/api/v1/zones/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['dashboard/list-zones']);
      });
  }
}
