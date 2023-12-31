import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { addEmployeeForm } from './add-employee.form';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent {
  addEmployeeForm = addEmployeeForm();

  constructor(private employeeService: EmployeeService) {}

  registerEmployee(): void {
    this.employeeService
      .addEmployee({ ...this.addEmployeeForm.value, adminId: 7 })
      .subscribe((response) => {
        console.log(response);
      });
  }
}
