import { Component } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
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
