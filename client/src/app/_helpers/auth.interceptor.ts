import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';
import { Observable, catchError, throwError } from 'rxjs';

const TOKEN_HEADER_KEY = 'authorization'; // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let request = req;
    const token = this.token.getToken();
    if (token != null) {
      request = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token),
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.error.message);
        return throwError(() => error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
