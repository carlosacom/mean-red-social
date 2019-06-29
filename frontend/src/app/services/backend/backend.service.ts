import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../auth/user.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private _url: string;
  constructor(
    private _http: HttpClient,
    private _userAuth: UserService
  ) {
    this._url = 'http://localhost:3000/';
  }

  private postQuery(query: string, data: any, token: boolean = true) {
    const url = this._url + query;
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this._userAuth.getToken());
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/json');
    }
    return this._http.post(url, data, { headers }).pipe(
      catchError(err => this.catchError(err))
    );
  }

  private catchError(err: any) {
    err = (err.status === 403 || err.status === 401) ? this._userAuth.logout() : err;
    return throwError(err);
  }

  postLogin = data => this.postQuery('users/login', data, false);
  postRegister = data => this.postQuery('users', data, false);
}
