import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ZoneService } from 'src/app/zones/zone.service';
import { SensorService } from '../sensor.service';
import { Zone } from 'src/app/zones/zone.model';
@Component({
  selector: 'app-create-sensor',
  templateUrl: './sensor-create.component.html',
  styleUrls: ['sensor-create.component.css'],
})
export class SensorCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private mode = 'create';
  selected = 'none';
  zones: Zone[];
  private zonesSub: Subscription;
  constructor(
    public sensorService: SensorService,
    public zoneService: ZoneService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      ID: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      zone: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.zoneService.getZones();
    this.zonesSub = this.zoneService
      .getZoneUpdateListener()
      .subscribe((ZoneData: { zones: Zone[]; zoneCount: number }) => {
        this.zones = ZoneData.zones;
      });
  }

  onSaveSensor() {
    const ID = this.form.value.ID;
    const zone = this.form.value.zone;
    console.log(ID, zone);
    this.sensorService.addSensor(ID, zone);
  }
  ngOnDestroy() {
    this.zonesSub.unsubscribe();
  }
}
