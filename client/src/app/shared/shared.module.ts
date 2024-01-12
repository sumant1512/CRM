import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../_pipes/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const PIPES = [FilterPipe];
const MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [...PIPES],
  imports: [...MODULES],
  exports: [...PIPES, ...MODULES],
})
export class SharedModule {}
