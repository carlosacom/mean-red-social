import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _router: Router
  ) { }

  validateSession() {
    if (this.getIdentity() && this.getToken()) {
      this._router.navigate(['/inicio']);
    }
  }

  isLogin() {
    return (this.getIdentity() && this.getToken());
  }
  login(dataUser: any) {
    this.setToken(dataUser.token);
    this.setUser(dataUser.user);
  }
  setToken(token: string) {
    localStorage.setItem(environment.localToken, token);
  }
  setUser(user: object) {
    localStorage.setItem(environment.localUser, JSON.stringify(user));
  }

  getIdentity() {
    let identity = JSON.parse(localStorage.getItem(environment.localUser));
    if (identity === 'undefined') {
      identity = null;
    }
    return identity;
  }
  getToken() {
    let token = localStorage.getItem(environment.localToken);
    if (token === 'undefined') {
      token = null;
    }
    return token;
  }

  logout() {
    localStorage.removeItem(environment.localToken);
    localStorage.removeItem(environment.localUser);
    this._router.navigate(['/inicio']);
  }
}
