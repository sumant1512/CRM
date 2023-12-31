import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddCategoryRequestBody } from './category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrls: ApiType = AppConfigurations.api;

  categoryies = [
    {
      id: 1,
      categoryName: 'Material',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  constructor(private http: HttpClient) {}

  fetchCategory(): Observable<any> {
    return of(this.categoryies);
    // return this.http.get<any>(this.apiUrls.category).pipe(
    //   map((response) => {
    //     if (response) {
    //       return response.data;
    //     }
    //   })
    // );
  }

  addCategory(body: IAddCategoryRequestBody): Observable<any> {
    return this.http.post<any>(this.apiUrls.category, body).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }
}
