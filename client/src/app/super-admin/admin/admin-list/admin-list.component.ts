import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  subscription = new Subscription();
  employeeList = [
    {
      id: 1,
      firstName: 'Sumant',
      lastName: 'Mishra',
      email: 'sumantmishra43@gmail.com',
    },
    {
      id: 2,
      firstName: 'Sumit',
      lastName: 'Mishra',
      email: 'sumantmishra42@gmail.com',
    },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAdminList();
  }

  getAdminList(): void {
    this.subscription.add(
      this.adminService.fetchAdmins().subscribe((response) => {
        console.log(response);
      })
    );
  }
}
