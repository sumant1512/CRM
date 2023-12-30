import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddAdminRequestBody } from './admin.interface';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  fetchAdmins(): Observable<any> {
    return this.http.get<any>(this.apiUrls.admins).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  addAdmin(body: IAddAdminRequestBody): Observable<any> {
    return this.http.post<any>(`${this.apiUrls.addAdmin}`, body).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }

  updateAdminStatus(status: number, adminId: number): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrls.activateAdmin}/${adminId}`, { status: status })
      .pipe(
        map((response) => {
          if (response) {
            return response;
          }
        })
      );
  }
}
