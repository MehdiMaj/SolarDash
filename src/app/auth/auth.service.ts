import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  createUser(
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    };
    this.http
      .post('http://localhost:9000/api/v1/users/signup', authData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/dashboard']);
      });
  }

  // login(
  //   name: string,
  //   email: string,
  //   password: string,
  //   passwordConfirm: string
  // ) {
  //   const authData: AuthData = {
  //     name: name,
  //     email: email,
  //     password: password,
  //     passwordConfirm: passwordConfirm,
  //   };
  //   this.http
  //     .post<{token:string}>('http://localhost:9000/api/users/login', authData)
  //     .subscribe((response) => {
  //       const token = response.token
  //  this.token = token;
  //     });
  // }
}
