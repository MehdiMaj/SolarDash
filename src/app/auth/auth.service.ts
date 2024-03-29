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
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }
  forgotPassword(email: string) {
    this.http
      .post<{ status: string; token: string }>(
        'http://localhost:9000/api/v1/users/forgotPassword',
        {
          email: email,
        }
      )
      .subscribe((response) => {});
  }
  resetPassword(password: string, passwordConfirm: string, token: string) {
    this.http
      .patch<{ status: string; token: string }>(
        'http://localhost:9000/api/v1/users/resetPassword/' + token,
        {
          password: password,
          passwordConfirm: passwordConfirm,
        }
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = 3600; //response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);
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
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = 3600; //response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return '';
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
