import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AppConfigurations } from 'src/app/config/config';
import { ApiType } from 'src/app/config/config.type';
import { IAddWalletMoneyRequestBody } from './wallet.interface';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  apiUrls: ApiType = AppConfigurations.api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) {}

  fetchWallets(adminId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrls.wallet}/${adminId}`).pipe(
      map((response) => {
        if (response) {
          return response.data;
        }
      })
    );
  }

  addWallet(body: IAddWalletMoneyRequestBody): Observable<any> {
    return this.http.post<any>(this.apiUrls.wallet, body).pipe(
      map((response) => {
        if (response) {
          return response;
        }
      })
    );
  }
}
