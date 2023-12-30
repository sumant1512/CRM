import { Component } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
})
export class SuperAdminComponent {
  subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private tokenService: TokenStorageService
  ) {}

  toggle(): void {
    const $wrapper = document.querySelector('#wrapper') as HTMLElement;
    $wrapper.classList.toggle('toggled');
  }

  logout(): void {
    // this.subscription.add(this.authService.logout());
    this.tokenService.signOut();
  }
}
