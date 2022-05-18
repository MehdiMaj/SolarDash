import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { HeaderComponent } from './header/header.component';
import { SiteCreateComponent } from './sites/sites-create/site-create.component';
import { SiteListComponent } from './sites/sites-list/site-list.component';
import { ZoneCreateComponent } from './zones/zone-create/zone-create.component';
import { ZoneListComponent } from './zones/zone-list/zone-list.component';
import { SensorCreateComponent } from './sensors/sensor-create/sensor-create.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './Home/home.component';

import { MainChartComponent } from './charts/total-chart/main-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { MatNativeDateModule } from '@angular/material/core';
import { PhasesAChartComponent } from './charts/phasesA-chart/phasesA-chart.component';
import { PhasesBChartComponent } from './charts/phasesB-chart/phasesB-chart.component';
import { MainChartByYearComponent } from './charts/total-chart/main-filtredByYears-chart.component';
import { MapComponent } from './map/map.component';
import { WeatherComponent } from './weather/weather.component';
import { TemperatureAndHumidityComponent } from './charts/Temperature/temperatureAndHumidity.component';
import { HistoryComponent } from './History/history.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    SiteCreateComponent,
    SiteListComponent,
    ZoneCreateComponent,
    ZoneListComponent,
    SensorCreateComponent,
    ForgotPasswordComponent,
    ErrorComponent,
    HomeComponent,
    MainChartComponent,
    PhasesAChartComponent,
    PhasesBChartComponent,
    MainChartByYearComponent,
    MapComponent,
    WeatherComponent,
    TemperatureAndHumidityComponent,
    HistoryComponent,
  ],
  imports: [
    NgChartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
