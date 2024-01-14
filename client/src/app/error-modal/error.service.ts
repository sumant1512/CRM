import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errorData = new BehaviorSubject<any>('');

  constructor() {}

  setError(error: any): void {
    this.errorData.next(error);
  }

  removeError(): void {
    this.errorData.next('');
  }
}
