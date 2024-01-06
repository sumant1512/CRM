import { Component } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent {
  subscription = new Subscription();
  constructor(
    private tokenService: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  toggle(): void {
    const $wrapper = document.querySelector('#wrapper') as HTMLElement;
    $wrapper.classList.toggle('toggled');
  }

  logout(): void {
    this.subscription.add(
      this.authService.logout().subscribe((response) => {
        if (response.status) {
          this.tokenService.signOut();
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
