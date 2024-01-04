import { Component } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent {
  constructor(private tokenService: TokenStorageService) {}

  toggle(): void {
    const $wrapper = document.querySelector('#wrapper') as HTMLElement;
    $wrapper.classList.toggle('toggled');
  }

  logout(): void {
    // this.subscription.add(this.authService.logout());
    this.tokenService.signOut();
  }
}
