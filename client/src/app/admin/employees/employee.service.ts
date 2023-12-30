import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddEmployeeRequestBody } from './employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(private http: HttpClient) {}

  fetchEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrls.employees).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  addEmployee(body: IAddEmployeeRequestBody): Observable<any> {
    return this.http.post<any>(`${this.apiUrls.addEmployee}`, body).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }

  updateEmployeeStatus(status: number, employeeId: number): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrls.activateEmployee}/${employeeId}`, {
        status: status,
      })
      .pipe(
        map((response) => {
          if (response) {
            return response;
          }
        })
      );
  }
}
