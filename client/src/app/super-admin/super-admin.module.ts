import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminComponent } from './super-admin.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [SuperAdminComponent, HomeComponent],
  imports: [CommonModule, SuperAdminRoutingModule],
})
export class SuperAdminModule {}
