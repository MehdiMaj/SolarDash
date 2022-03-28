import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ZoneService } from '../zone.service';
import { MatTableDataSource } from '@angular/material/table';
import { Zone } from '../zone.model';

import { Subscription } from 'rxjs';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ZoneListComponent implements AfterViewInit, OnDestroy {
  zones: Zone[] = [];
  isLoading = false;
  private zoneSub: Subscription;

  dataSource: MatTableDataSource<Zone>;
  totalZones = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = ['Name', 'Affected To', 'createdAt'];

  sitesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  expandedElement: Zone | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public zoneService: ZoneService) {}
  ngAfterViewInit(): void {
    this.isLoading = true;
    this.zoneService.getZones();
    this.zoneSub = this.zoneService
      .getZoneUpdateListener()
      .subscribe((zoneData: { zones: Zone[]; zoneCount: number }) => {
        this.isLoading = false;
        this.totalZones = zoneData.zoneCount;
        this.zones = zoneData.zones;
        this.dataSource = new MatTableDataSource(this.zones);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
  ngOnDestroy(): void {
    this.zoneSub.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
