import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Routes } from '@angular/router';
import * as Containers from './index';

export const AdminLayoutRoutes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Containers.DashboardComponent },
  { path: 'forms', component: Containers.FormsComponent },
  { path: 'tables', component: Containers.TablesComponent },
  { path: 'typography', component: Containers.TypographyComponent },
  { path: 'maps', component: Containers.MapsComponent },

  { path: 'users', component: Containers.AdminUsersComponent },
  { path: 'users/info/:id', component: Containers.UserInfoComponent },
  { path: 'attendees', component: Containers.AdminAttendeesComponent },
  { path: 'attendees/info/:id', component: Containers.AdminAttendeesInfoComponent },
  { path: 'attendees/new', component: Containers.AdminNewAttendeeComponent },
  { path: 'attendees/edit/:id', component: Containers.AdminNewAttendeeComponent },
  { path: 'notifications', component: Containers.NotificationsComponent },
  { path: 'usersetting/:id', component: Containers.UserSettingComponent },
  { path: 'projects', component: Containers.AdminProjectsComponent },
  { path: 'projects/:id', component: Containers.ProjectInfoComponent },
  { path: 'delegate', component: Containers.AdminDelegateEmailComponent },

  { path: 'settings', component: Containers.AdminSettingsComponent },
];
