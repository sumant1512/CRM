import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';
import { IAdmins } from '../admin.interface';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  subscription = new Subscription();
  adminList: Array<IAdmins> = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAdminList();
  }

  upateStatus(status: number, adminId: number): void {
    this.subscription.add(
      this.adminService
        .updateAdminStatus(status, adminId)
        .subscribe((response) => {
          console.log(response);
        })
    );
  }

  getAdminList(): void {
    this.subscription.add(
      this.adminService.fetchAdmins().subscribe((response) => {
        this.adminList = response;
      })
    );
  }
}
