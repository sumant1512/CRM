import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddExpenseRequestBody, IExpense } from './expenses.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  apiUrls: ApiType = AppConfigurations.api;
  employee: Array<IExpense> = [
    {
      id: 1,
      description: 'Sand bought',
      categoryId: 1,
      userId: 9,
      adminId: 5,
      categoryName: 'Material',
      firstName: 'Employee',
      lastName: 'One',
      createdAt: new Date().toString(),
      modifiedAt: new Date().toString(),
      expensePrice: '900000',
    },
    {
      id: 2,
      description: 'Cement bought',
      categoryId: 1,
      userId: 9,
      adminId: 5,
      categoryName: 'Material',
      firstName: 'Employee',
      lastName: 'One',
      createdAt: new Date().toString(),
      modifiedAt: new Date().toString(),
      expensePrice: '90000',
    },
  ];

  constructor(private http: HttpClient) {}

  fetchExpenses(): Observable<any> {
    return of(this.employee);
    // return this.http.get<any>(this.apiUrls.employees).pipe(
    //   map((response) => {
    //     if (response) {
    //       return response.data;
    //     }
    //   })
    // );
  }

  addExpense(body: IAddExpenseRequestBody): Observable<any> {
    return this.http.post<any>(`${this.apiUrls.expense}`, body).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }
}
