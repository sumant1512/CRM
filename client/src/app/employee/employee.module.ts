import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [EmployeeComponent, HomeComponent, ProfileComponent],
  imports: [CommonModule, EmployeeRoutingModule],
})
export class EmployeeModule {}
