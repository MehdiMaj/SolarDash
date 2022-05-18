import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  events: string[] = [];
  opened: boolean;
  closed = true;
  constructor(private authService: AuthService) {}
  onLogout() {
    this.authService.logout();
  }
  openCloseNav() {
    if (this.closed) {
      document.getElementById('mySidenav').style.width = '250px';
      document.getElementById('main').style.marginLeft = '250px';
      this.closed = false;
    } else {
      document.getElementById('mySidenav').style.width = '0';
      document.getElementById('main').style.marginLeft = '0';
      this.closed = true;
    }
  }
}
