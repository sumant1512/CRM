import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [AdminComponent, HomeComponent],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
