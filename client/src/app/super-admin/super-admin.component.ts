import { Component } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
})
export class SuperAdminComponent {
  subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private tokenService: TokenStorageService,
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
