import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddAdminRequestBody } from './admin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(private http: HttpClient) {}

  fetchAdmins(): Observable<any> {
    return of([
      {
        id: 1,
        name: 'Swigy',
        userName: 'swigy',
        password: '123456',
        token: 'swigy123456',
        status: 'Active',
        createdOn: '12/22/2003',
        lastUpdatedOn: '12/12/2022',
      },
    ]);
    return this.http.get<any>(this.apiUrls.admins).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  addAdmin(body: IAddAdminRequestBody): Observable<any> {
    return this.http.post<any>(`${this.apiUrls.addAdmin}`, {}).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }

  deleteAdmin(id: number): Observable<any> {
    console.log(id);
    return this.http.delete<any>(`${this.apiUrls.admins}/${id}`).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }
}
