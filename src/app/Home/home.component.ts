import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { Sensor } from '../sensors/sensor.model';
import { SensorService } from '../sensors/sensor.service';
import { Site } from '../sites/site.model';
import { SiteService } from '../sites/site.service';
import { Zone } from '../zones/zone.model';
import { ZoneService } from '../zones/zone.service';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private siteSub: Subscription;
  private zoneSub: Subscription;
  private sensorSub: Subscription;

  timeStart = 0;
  timeEnd = 0;
  date = new FormControl(new Date());
  previousDate = null;

  month = new FormControl(
    `${new Date().getUTCFullYear()}-0${new Date().getMonth()}`
  );
  previousMonth = null;

  year = new FormControl();
  previousYear = null;

  dateTemp = new FormControl(new Date());
  previousDateTemp = null;

  monthTemp = new FormControl(
    `${new Date().getUTCFullYear()}-0${new Date().getMonth()}`
  );
  previousMonthTemp = null;

  yearTemp = new FormControl();
  previousYearTemp = null;

  selectedFilter: string;

  selectedYear: string;
  selectedYearTemp: string;

  selected = new FormControl(0);
  selectedTemp = new FormControl(0);

  dateStart: string;

  sensors: Sensor[] = [];
  /*memorizing in case we don't call the backend API */
  sensorDayByDay: Sensor;
  sensorMonths: Sensor;
  sensorYears: Sensor;

  sensorDayByDayTemp: Sensor;
  sensorMonthsTemp: Sensor;
  sensorYearsTemp: Sensor;
  /********************/
  sites: Site[];
  firstSite: string;

  siteIsSelected = false;
  DataIsProcessed = false;
  zoneIsSelected = false;
  dateIsSelected = false;
  sensorIsSelected = false;
  // filterIsSelected = false;
  isLoading = false;

  years = new Array();
  zones: Zone[];
  form: FormGroup;

  selections: string[] = ['Total', 'Phase A', 'Phase B'];
  myFilter = 'DAY-BY-DAY';
  myFilterTemp = 'DAY-BY-DAY';
  select: string = 'Total';
  location;
  constructor(
    public siteService: SiteService,
    public zoneService: ZoneService,
    public sensorService: SensorService,
    private cdref: ChangeDetectorRef
  ) {}
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      site: new FormControl(null, {
        validators: [Validators.required],
      }),
      zone: new FormControl(null, { validators: [Validators.required] }),
    });

    for (var i = 1900; i <= 3000; i++) {
      this.years.push(i);
    }
    this.siteService.getSites();
    this.siteSub = this.siteService
      .getSiteUpdateListener()
      .subscribe((siteData: { sites: Site[]; siteCount: number }) => {
        this.sites = siteData.sites;
        this.form.controls['site'].setValue(
          this.sites[this.sites.length - 1].id
        );
        this.location = {
          lat: this.sites[this.sites.length - 1].lat,
          lng: this.sites[this.sites.length - 1].lng,
        };
        this.getZones();
      });
    this.selectedYear = new Date().getUTCFullYear().toString();
    this.select = 'Total';
  }
  getZones() {
    for (var i in this.sites) {
      if (this.form.controls['site'].value === this.sites[i].id) {
        this.location = { lat: this.sites[i].lat, lng: this.sites[i].lng };
      }
    }
    this.zoneService.getZonesBySite(this.form.controls['site'].value);
    this.zoneSub = this.zoneService
      .getZoneUpdateListener()
      .subscribe((zoneData: { zones: Zone[]; zoneCount: number }) => {
        this.zones = zoneData.zones;
      });
  }
  getDataPerZoneBothTypes() {
    this.getDataPerZone('compteur');
    this.getDataPerZone('temperature');
  }
  setTimeDay(type: string) {
    if (type === 'compteur') {
      console.log(this.date.value.getTime());
      this.timeStart = new Date(this.date.value.getTime()).setUTCHours(
        0,
        0,
        0,
        0
      );
      this.timeEnd = new Date(this.date.value.getTime()).setUTCHours(
        0,
        0,
        0,
        0
      );
      this.previousDate = this.date.value;
      console.log(this.timeStart);
    } else if (type === 'temperature') {
      console.log(this.dateTemp.value.getTime());
      this.timeStart = new Date(this.dateTemp.value.getTime()).setUTCHours(
        0,
        0,
        0,
        0
      );
      this.timeEnd = new Date(this.dateTemp.value.getTime()).setUTCHours(
        0,
        0,
        0,
        0
      );
      this.previousDateTemp = this.dateTemp.value;
      console.log(this.timeStart);
    }
  }
  setTimeMonth() {
    console.log(this.month.value);
    console.log(this.month.value);
    this.timeStart = new Date(new Date(this.month.value).getTime()).setUTCHours(
      0,
      0,
      0,
      0
    );
    this.timeEnd = new Date(new Date(this.month.value).getTime()).setUTCHours(
      0,
      0,
      0,
      0
    );
    this.previousMonth = this.month.value;
    console.log(this.timeStart);
  }
  setTimeYear() {
    this.timeStart = new Date(Number(this.selectedYear), 1, 1).getTime();
    this.timeEnd = new Date(Number(this.selectedYear), 1, 1).getTime();
    this.previousYear = this.selectedYear;
  }
  setFilter(type: string) {
    let filter;
    if (type === 'compteur') {
      this.myFilterTemp = null;
      switch (this.selected.value) {
        case 0:
          this.myFilter = 'DAY-BY-DAY';
          this.setTimeDay(type);
          break;
        case 1:
          this.myFilter = 'MONTHS';
          this.setTimeMonth();
          break;
        case 2:
          this.myFilter = 'YEARS';
          this.setTimeYear();
          break;
      }
    } else {
      this.myFilter = null;
      switch (this.selectedTemp.value) {
        case 0:
          this.myFilterTemp = 'DAY-BY-DAY';
          this.setTimeDay(type);
          break;
        case 1:
          this.myFilterTemp = 'MONTHS';
          break;
        case 2:
          this.myFilterTemp = 'YEARS';
          break;
      }
    }
    return this.myFilter ? this.myFilter : this.myFilterTemp;
  }
  getDataPerZone(type: string) {
    //check with previous dates to not resend unnecessary calls to backend
    if (
      this.previousDate != this.date.value ||
      this.previousYear != this.selectedYear ||
      this.previousMonth != this.month.value ||
      this.previousMonth != this.monthTemp.value ||
      this.previousYearTemp != this.selectedYearTemp ||
      this.previousDateTemp != this.dateTemp.value
    ) {
      let filter: string;

      this.timeStart = 0;
      this.timeEnd = 0;
      filter = this.setFilter(type);
      console.log(filter);
      this.isLoading = true;

      this.sensorService
        .getFiltredSensor(
          this.form.controls['zone'].value,
          this.timeStart,
          this.timeEnd,
          filter,
          type
        )
        .then((data) => {
          this.setDataSensor(data.data, type);
        });
    }
    this.DataIsProcessed = true;
  }
  setDataSensor(sensor: Sensor, type: string) {
    if (type === 'compteur') {
      if (this.selected.value === 0) this.sensorDayByDay = sensor[0];
      else if (this.selected.value === 1) this.sensorMonths = sensor[0];
      else this.sensorYears = sensor[0];
    } else if (type === 'temperature') {
      console.log('here');
      if (this.selectedTemp.value === 0) this.sensorDayByDayTemp = sensor[0];
      else if (this.selectedTemp.value === 1) this.sensorMonthsTemp = sensor[0];
      else this.sensorYearsTemp = sensor[0];
    }
    this.isLoading = false;
    console.log(this.isLoading);
  }

  ngOnDestroy() {
    this.siteSub.unsubscribe();
  }
}
