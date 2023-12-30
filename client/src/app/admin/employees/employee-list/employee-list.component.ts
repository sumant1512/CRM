import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Subscription } from 'rxjs';
import { IEmployees } from '../employee.interface';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  subscription = new Subscription();
  employeeList: Array<IEmployees> = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  upateStatus(status: number, employeeId: number): void {
    this.subscription.add(
      this.employeeService
        .updateEmployeeStatus(status, employeeId)
        .subscribe((response: any) => {
          console.log(response);
        })
    );
  }

  getEmployeeList(): void {
    this.subscription.add(
      this.employeeService.fetchEmployees().subscribe((response: any) => {
        this.employeeList = response;
        console.log(this.employeeList);
      })
    );
  }
}
