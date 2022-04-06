import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SensorCreateComponent } from './sensors/sensor-create/sensor-create.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SiteCreateComponent } from './sites/sites-create/site-create.component';
import { SiteListComponent } from './sites/sites-list/site-list.component';
import { ZoneCreateComponent } from './zones/zone-create/zone-create.component';
import { ZoneListComponent } from './zones/zone-list/zone-list.component';

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
    path: 'forgot-password/:token',
    component: ForgotPasswordComponent,
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
        path: 'edit-site/:siteId',
        component: SiteCreateComponent,
      },
      {
        path: 'create-zone',
        component: ZoneCreateComponent,
      },
      {
        path: 'list-zones',
        component: ZoneListComponent,
      },
      {
        path: 'edit-zone/:zoneId',
        component: ZoneCreateComponent,
      },
      {
        path: 'create-sensor',
        component: SensorCreateComponent,
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
