import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Site } from './site.model';

@Injectable({ providedIn: 'root' })
export class SitesService {
  private sites: Site[] = [];
  private sitesUpdated = new Subject<{ sites: Site[]; siteCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  addSite(name: string, description: string) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    this.http
      .post<{ message: string; site: Site }>(
        'http://localhost:9000/api/v1/sites',
        formData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  getSites(SitesPerPage: number, currentPage: number) {
    const queryParams = `?limit=${SitesPerPage}&page=${currentPage}`;
    this.http
      .get<{ status: string; data: any; results: number }>(
        'http://localhost:9000/api/v1/sites' + queryParams
      )
      .pipe(
        map((siteData) => {
          return {
            sites: siteData.data.map((site) => {
              return {
                name: site.name,
                description: site.description,
                id: site._id,
              };
            }),
            maxSites: siteData.results,
          };
        })
      )
      .subscribe((transformedSiteData) => {
        this.sites = transformedSiteData.sites;
        this.sitesUpdated.next({
          sites: [...this.sites],
          siteCount: transformedSiteData.maxSites,
        });
      });
  }
  getSite(id: string) {
    return this.http.get<{ status: string; data: any }>(
      'http://localhost:9000/api/v1/sites/' + id
    );
  }
  getSiteUpdateListener() {
    return this.sitesUpdated.asObservable();
  }

  deleteSite(siteId: string) {
    return this.http.delete('http://localhost:9000/api/v1/sites/' + siteId);
  }

  updateSite(id: string, name: string, description: string) {
    const postData: Site = {
      id: id,
      name: name,
      description: description,
    };

    this.http
      .patch('http://localhost:9000/api/v1/sites/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['dashboard/list-sites']);
      });
  }
}
