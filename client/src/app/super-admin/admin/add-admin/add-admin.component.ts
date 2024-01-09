import { Component } from '@angular/core';
import { addAdminForm } from './add-admin.form';
import { AdminService } from '../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent {
  addAdminForm = addAdminForm();

  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  registerAdmin(): void {
    this.adminService
      .addAdmin(this.addAdminForm.value)
      .subscribe((response) => {
        if (response.status) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      });
  }
}
