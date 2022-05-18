import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Sensor } from '../sensors/sensor.model';
import { SensorService } from '../sensors/sensor.service';
import { Site } from '../sites/site.model';
import { SiteService } from '../sites/site.service';
import { Zone } from '../zones/zone.model';
import { ZoneService } from '../zones/zone.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  zones: Zone[];
  sites: Site[];
  form: FormGroup;
  date = new FormControl(new Date());
  private siteSub: Subscription;
  private zoneSub: Subscription;
  private sensorSub: Subscription;
  selected = new FormControl(0);
  sensorDayByDay: Sensor;
  siteIsSelected = false;
  DataIsProcessed = false;
  select: string = 'Total';
  timeStart = 0;
  timeEnd = 0;
  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
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

    this.siteService.getSites();
    this.siteSub = this.siteService
      .getSiteUpdateListener()
      .subscribe((siteData: { sites: Site[]; siteCount: number }) => {
        this.sites = siteData.sites;
        this.form.controls['site'].setValue(
          this.sites[this.sites.length - 1].id
        );

        this.getZones();
      });
  }
  getZones() {
    this.zoneService.getZonesBySite(this.form.controls['site'].value);
    this.zoneSub = this.zoneService
      .getZoneUpdateListener()
      .subscribe((zoneData: { zones: Zone[]; zoneCount: number }) => {
        this.zones = zoneData.zones;
      });
  }

  getDataPerZone(type: string) {
    if (
      this.range.controls['start'].value &&
      this.range.controls['end'].value
    ) {
      this.sensorService
        .getFiltredSensor(
          this.form.controls['zone'].value,
          this.range.controls['start'].value.getTime(),
          this.range.controls['end'].value.getTime(),
          'DAY-BY-DAY',
          type
        )
        .then((data) => this.setDataSensor(data.data, type));

      this.DataIsProcessed = true;
    }
  }
  setDataSensor(sensor: Sensor, type: string) {
    this.sensorDayByDay = sensor[0];
  }
}
