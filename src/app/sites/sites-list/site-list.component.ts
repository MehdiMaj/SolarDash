import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Site } from '../site.model';
import { SitesService } from '../sites.service';

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
  private postsSub: Subscription;

  constructor(public sitesService: SitesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.sitesService.getSites(this.sitesPerPage, this.currentPage);
    this.postsSub = this.sitesService
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
    this.sitesService.getSites(this.sitesPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.sitesService.deleteSite(postId).subscribe(() => {
      this.sitesService.getSites(this.sitesPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
