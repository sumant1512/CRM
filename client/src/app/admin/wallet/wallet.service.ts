import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddWalletMoneyRequestBody } from './wallet.interface';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(private http: HttpClient) {}

  fetchWallets(adminId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrls.wallet}/${adminId}`).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  addMoneyToWallet(body: IAddWalletMoneyRequestBody): Observable<any> {
    return this.http.put<any>(this.apiUrls.wallet, body).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }
}
