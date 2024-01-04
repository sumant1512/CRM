import { Component } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
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
