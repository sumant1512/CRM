import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AppConfigurations } from '../config/config';
import { ApiType } from '../config/config.type';
import { TokenStorageService } from '../_services/token-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrls: ApiType = AppConfigurations.api;
  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) {}

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

  getUserPoints(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrls.points}/${userId}`).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  logout(): Observable<any> {
    const userId = this.tokenService.getUser().id;
    return this.http.get<any>(`${this.apiUrls.logout}/${userId}`).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }

  resetPasswrd(body: any): Observable<any> {
    return this.http.post(this.apiUrls.resetPassword, body, httpOptions);
  }
}
