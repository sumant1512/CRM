import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ErrorService } from './error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  message!: string;
  @ViewChild('errorModal') errorModal!: ElementRef;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.getError();
  }

  getError(): void {
    this.subscription.add(
      this.errorService.errorData.subscribe((response) => {
        if (response) {
          this.message = response;
          this.open();
        }
      })
    );
  }

  open(): void {
    let el = this.errorModal?.nativeElement;
    el?.setAttribute('style', 'display: block');
    el?.classList?.add('show');
  }

  close(): void {
    let el = this.errorModal?.nativeElement;
    el?.setAttribute('style', 'display: none');
    el?.classList?.remove('show');
    this.errorService.removeError();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
