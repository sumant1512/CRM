import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigurations } from '../config/config';
import { ApiType } from '../config/config.type';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrls: ApiType = AppConfigurations.api;
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      this.apiUrls.login,
      {
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): void {}
}
