import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddEmployeeRequestBody, IEmployees } from './employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrls: ApiType = AppConfigurations.api;
  employee: Array<IEmployees> = [
    {
      firstName: 'Employee',
      lastName: 'One',
      email: 'employeeone@gmail.com',
      mobileNumber: '1234567890',
      roleId: 3,
      createdAt: new Date().toISOString(),
      id: 9,
      isActive: 1,
      isVerified: 1,
      modifiedAt: new Date().toDateString(),
      adminId: 7,
    },
    {
      firstName: 'Employee',
      lastName: 'Two',
      email: 'employeetwo@gmail.com',
      mobileNumber: '9876543210',
      roleId: 3,
      createdAt: new Date().toISOString(),
      id: 10,
      isActive: 1,
      isVerified: 1,
      modifiedAt: new Date().toDateString(),
      adminId: 7,
    },
  ];

  constructor(private http: HttpClient) {}

  fetchEmployees(): Observable<any> {
    return of(this.employee);
    // return this.http.get<any>(this.apiUrls.employees).pipe(
    //   map((response) => {
    //     if (response) {
    //       return response.data;
    //     }
    //   })
    // );
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
