import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  toggle(): void {
    const $wrapper = document.querySelector('#wrapper') as HTMLElement;
    $wrapper.classList.toggle('toggled');
  }
}
