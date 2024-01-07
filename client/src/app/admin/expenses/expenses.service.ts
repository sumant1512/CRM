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

  constructor(private http: HttpClient) {}

  fetchExpenses(): Observable<any> {
    // return of(this.employee);
    return this.http.get<any>(this.apiUrls.employees).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
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
