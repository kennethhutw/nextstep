
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin.routing';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NavbarComponent } from '../components/admin/navbar/navbar.component';
import { SidebarComponent } from '../components/admin/sidebar/sidebar.component';
import { AdminFooterComponent } from '../components/admin/footer/footer.component';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  BlockchainComponent,
  DashboardComponent,
  TablesComponent,
  FormsComponent,
  TypographyComponent,
  MapsComponent,
  NotificationsComponent,
  AdminUsersComponent
} from './index';


@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    TooltipModule,
    BsDatepickerModule.forRoot(),

    TimepickerModule

  ],
  declarations: [
    // NavbarComponent,
    // SidebarComponent,
    // AdminFooterComponent,
    AdminUsersComponent,
    BlockchainComponent,
    DashboardComponent,
    TablesComponent,
    FormsComponent,
    TypographyComponent,
    MapsComponent,
    NotificationsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CommonModule
  ]
})

export class AdminLayoutModule { }
