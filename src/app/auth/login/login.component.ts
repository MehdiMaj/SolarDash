import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSub: Subscription;
  constructor(public authService: AuthService) {}
  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onForgotPassword(form: NgForm, event: Event) {
    event.preventDefault();
    //if (!form.value.email=== "") return;
    this.authService.forgotPassword(form.value.email);
  }
}
