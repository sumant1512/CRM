import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddEmployeeRequestBody, IEmployees } from './employee.interface';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) {}

  fetchEmployees(): Observable<any> {
    return this.http
      .post<any>(this.apiUrls.employees, {
        adminId: this.tokenService.getUser().id,
      })
      .pipe(
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
