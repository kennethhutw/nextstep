
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin.routing';


import { NavbarComponent } from '../components/admin/navbar/navbar.component';
import { SidebarComponent } from '../components/admin/sidebar/sidebar.component';
import { AdminFooterComponent } from '../components/admin/footer/footer.component';

import {
  DashboardComponent,
  TablesComponent,
  FormsComponent,
  TypographyComponent,
  MapsComponent,
  NotificationsComponent } from './index';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),

  ],
  declarations: [
    // NavbarComponent,
    // SidebarComponent,
    // AdminFooterComponent,
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
