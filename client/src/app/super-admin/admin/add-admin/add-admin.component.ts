import { Component } from '@angular/core';
import { addAdminForm } from './add-admin.form';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent {
  addAdminForm = addAdminForm();

  constructor(private adminService: AdminService) {}

  registerAdmin(): void {
    this.adminService
      .addAdmin(this.addAdminForm.value)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
