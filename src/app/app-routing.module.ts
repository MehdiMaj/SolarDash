import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SiteCreateComponent } from './sites/sites-create/site-create.component';
import { SiteListComponent } from './sites/sites-list/site-list.component';
import { ZoneCreateComponent } from './zones/zone-create/zone-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create-site',
        component: SiteCreateComponent,
      },
      {
        path: 'list-sites',
        component: SiteListComponent,
      },
      {
        path: 'edit/:siteId',
        component: SiteCreateComponent,
      },
      {
        path: 'create-zone',
        component: ZoneCreateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
