import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Site } from 'src/app/sites/site.model';
import { SitesService } from 'src/app/sites/sites.service';
import { ZonesService } from '../zone.service';

@Component({
  selector: 'app-create-zone',
  templateUrl: './zone-create.component.html',
  styleUrls: ['zone-create.component.css'],
})
export class ZoneCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private mode = 'create';
  private siteId: string;
  selected = 'none';
  sites: Site[];
  private sitesSub: Subscription;
  constructor(
    public sitesService: SitesService,
    public zonesService: ZonesService,
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
    this.sitesService.getSites();
    this.sitesSub = this.sitesService
      .getSiteUpdateListener()
      .subscribe((siteData: { sites: Site[]; siteCount: number }) => {
        this.sites = siteData.sites;
      });
  }

  onSaveZone() {
    const name = this.form.value.name;
    const site = this.form.value.site;
    this.zonesService.addZone(name, site);
  }
  ngOnDestroy() {
    this.sitesSub.unsubscribe();
  }
}
