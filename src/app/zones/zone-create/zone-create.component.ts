import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Site } from 'src/app/sites/site.model';
import { SiteService } from 'src/app/sites/site.service';
import { ZoneService } from '../zone.service';
import { Zone } from '../zone.model';

@Component({
  selector: 'app-create-zone',
  templateUrl: './zone-create.component.html',
  styleUrls: ['zone-create.component.css'],
})
export class ZoneCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private mode = 'create';
  private zoneId: string;
  isLoading = false;
  selected = 'none';
  zone: Zone;
  sites: Site[];
  private sitesSub: Subscription;
  constructor(
    public siteService: SiteService,
    public zoneService: ZoneService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      site: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.siteService.getSites();
    this.sitesSub = this.siteService
      .getSiteUpdateListener()
      .subscribe((siteData: { sites: Site[]; siteCount: number }) => {
        this.sites = siteData.sites;
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('zoneId')) {
        this.mode = 'edit';
        this.zoneId = paramMap.get('zoneId');
        this.isLoading = true;
        this.zoneService.getZone(this.zoneId).subscribe((zoneData) => {
          this.isLoading = false;
          this.zone = {
            id: zoneData.data._id,
            name: zoneData.data.name,
            site: zoneData.data.site,
            createdAt: zoneData.data.createdAt,
          };
          this.form.setValue({
            name: this.zone.name,
            site: zoneData.data.site._id,
          });
        });
      } else {
        this.mode = 'create';
        this.zoneId = null;
      }
    });
  }

  onSaveZone() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const name = this.form.value.name;
      const site = this.form.value.site;
      this.zoneService.addZone(name, site);
    } else {
      console.log(this.form.value.site.id);
      this.zoneService.updateZone(
        this.zoneId,
        this.form.value.name,
        this.form.value.site,
        this.zone.createdAt
      );
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.sitesSub.unsubscribe();
  }
}
