
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin.routing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SharedModule } from '../_shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as Containers from './index';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    TooltipModule,
    SharedModule,
    DataTablesModule,
    BsDatepickerModule.forRoot(),

    TimepickerModule

  ],
  declarations: [
    ...Containers.containers
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CommonModule
  ]
})

export class AdminLayoutModule { }
