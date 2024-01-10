import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddCategoryRequestBody } from './category.interface';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) {}

  fetchCategory(adminId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrls.category}/${adminId}`).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  addCategory(body: IAddCategoryRequestBody): Observable<any> {
    return this.http.post<any>(this.apiUrls.category, body).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }

  deleteCategory(adminId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrls.category}/${adminId}`).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }
}
