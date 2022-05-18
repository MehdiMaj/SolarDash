import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private data: [];
  private dataUpdated = new Subject<{ data: []; dataCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}
  getData(id: string) {
    this.http
      .get<{ status: string; data: any; results: number }>(
        'http://localhost:9000/api/v1/sensorsGlobal/' + id
      )
      .pipe(
        map((DataValues) => {
          return {
            data: DataValues.data.map((data) => {
              console.log(data);
              return {};
            }),
            maxData: DataValues.results,
          };
        })
      )
      .subscribe((transformedData) => {
        this.data = transformedData.data;
        this.dataUpdated.next({
          data: [...this.data],
          dataCount: transformedData.maxData,
        });
      });
  }
}
