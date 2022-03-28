import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  token = '';
  equal = true;
  constructor(public authService: AuthService, public route: ActivatedRoute) {}

  onResetPassword(form: NgForm) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (!(form.value.password === form.value.passwordConfirm)) {
        this.equal = false;
        return;
      }
      this.token = paramMap.get('token');
      this.authService.resetPassword(
        form.value.password,
        form.value.passwordConfirm,
        this.token
      );
    });
  }
}
