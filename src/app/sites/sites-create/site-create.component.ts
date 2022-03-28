import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Site } from '../site.model';
import { SiteService } from '../site.service';

@Component({
  selector: 'app-create-site',
  templateUrl: './site-create.component.html',
  styleUrls: ['site-create.component.css'],
})
export class SiteCreateComponent implements OnInit {
  form: FormGroup;
  private mode = 'create';
  private siteId: string;
  isLoading = false;
  site: Site;
  constructor(public siteService: SiteService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('siteId')) {
        this.mode = 'edit';
        this.siteId = paramMap.get('siteId');
        this.isLoading = true;
        this.siteService.getSite(this.siteId).subscribe((postData) => {
          this.isLoading = false;
          this.site = {
            id: postData.data._id,
            name: postData.data.name,
            description: postData.data.description,
          };
          this.form.setValue({
            name: this.site.name,
            description: this.site.description,
          });
        });
      } else {
        this.mode = 'create';
        this.siteId = null;
      }
    });
  }

  onSaveSite() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const name = this.form.value.name;
      const description = this.form.value.description;
      this.siteService.addSite(name, description);
    } else {
      this.siteService.updateSite(
        this.siteId,
        this.form.value.name,
        this.form.value.description
      );
    }
    this.form.reset();
  }
}
