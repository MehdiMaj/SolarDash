import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
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
      .post<{ token: string }>(
        'http://localhost:9000/api/v1/users/signup',
        authData
      )
      .subscribe((response) => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/dashboard']);
        }
      });
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string }>('http://localhost:9000/api/v1/users/login', {
        email: email,
        password: password,
      })
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/dashboard']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
