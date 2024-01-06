import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { loginForm, resetPasswordForm } from './login.form';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  subscription = new Subscription();
  loginForm = loginForm();
  resetPasswordForm = resetPasswordForm();
  isActive = true;
  isVerified = true;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  userRole!: number;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.userRole = this.tokenStorage.getUser().roleId;
    }
  }

  signUp(): void {
    alert('Please contact on 9579310997 to register.');
  }

  forgetPw(): void {
    alert('Please contact on 9579310997 to reset password.');
  }

  onSubmit(): void {
    this.isLoggedIn = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.tokenStorage.saveToken(response.authToken);
        this.tokenStorage.saveUser(response.data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.userRole = this.tokenStorage.getUser().roleId;
        this.navigateToUser(this.userRole);
      },
      error: (err) => {
        if (err && 'data' in err.error && 'isActive' in err.error?.data) {
          this.isActive = err.error.data.isActive;
        }
        if (err && 'data' in err.error && 'isVerified' in err.error?.data) {
          this.isVerified = err.error.data.isVerified;
          this.resetPasswordForm.controls['email'].setValue(
            err.error.data.email
          );
        }
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  navigateToUser(roleId: number): void {
    switch (roleId) {
      case 1:
        this.router.navigate(['super-admin']);
        break;
      case 2:
        this.router.navigate(['admin']);
        break;
      case 3:
        this.router.navigate(['employee']);
        break;

      default:
        break;
    }
  }

  backToLogin(): void {
    this.isActive = true;
    this.isLoggedIn = false;
    this.tokenStorage.signOut();
  }

  resetPassword(): void {
    const resetPwBody = {
      email: this.resetPasswordForm.get('email')?.value,
      oldPassword: 'admin',
      newPassword: this.resetPasswordForm.get('password')?.value,
    };
    this.subscription.add(
      this.authService.resetPasswrd(resetPwBody).subscribe((response) => {
        if (response.status) {
          this.isLoggedIn = false;
          this.isActive = true;
          this.isVerified = true;
          this.tokenStorage.signOut();
        }
      })
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
