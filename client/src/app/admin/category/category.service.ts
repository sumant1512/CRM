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

  categoryies = [
    {
      id: 1,
      categoryName: 'Material',
      createdAt: new Date(),
      modifiedAt: new Date(),
    },
  ];

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) {}

  fetchCategory(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrls.category}/${this.tokenService.getUser().id}`)
      .pipe(
        map((response) => {
          if (response) {
            return response.data;
          }
        })
      );
  }

  addCategory(body: IAddCategoryRequestBody): Observable<any> {
    console.log(body);
    return this.http.post<any>(this.apiUrls.category, body).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }
}
