import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userInfo: any;
  userPoints: number = 0;
  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.tokenStorage.getUser();
    this.getPointsByUserId(this.userInfo.id);
  }

  getPointsByUserId(userId: number): void {
    this.authService.getUserPoints(userId).subscribe((response) => {
      this.userPoints = response?.amount || 0;
    });
  }
}
