import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Site } from '../site.model';
import { SiteService } from '../site.service';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css'],
})
export class SiteListComponent implements OnInit, OnDestroy {
  sites: Site[] = [];
  isLoading = false;
  totalSites = 0;
  sitesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private sitesSub: Subscription;

  constructor(public siteService: SiteService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.siteService.getSites(this.sitesPerPage, this.currentPage);
    this.sitesSub = this.siteService
      .getSiteUpdateListener()
      .subscribe((siteData: { sites: Site[]; siteCount: number }) => {
        this.isLoading = false;
        this.totalSites = siteData.siteCount;
        this.sites = siteData.sites;
      });
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.sitesPerPage = pageData.pageSize;
    this.siteService.getSites(this.sitesPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.siteService.deleteSite(postId).subscribe(
      () => {
        this.siteService.getSites(this.sitesPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.sitesSub.unsubscribe();
  }
}
