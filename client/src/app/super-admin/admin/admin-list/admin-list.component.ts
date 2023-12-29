import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent {
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
}
