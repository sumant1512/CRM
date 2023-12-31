import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { addEmployeeForm } from './add-employee.form';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent {
  addEmployeeForm = addEmployeeForm();

  constructor(
    private employeeService: EmployeeService,
    private tokenService: TokenStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  registerEmployee(): void {
    this.employeeService
      .addEmployee({
        ...this.addEmployeeForm.value,
        adminId: this.tokenService.getUser().id,
      })
      .subscribe((response) => {
        if (response.status) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      });
  }
}
