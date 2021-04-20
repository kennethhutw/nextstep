import { Routes } from '@angular/router';
import * as Containers from './index';

export const AdminLayoutRoutes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Containers.DashboardComponent },
  { path: 'forms', component: Containers.FormsComponent },
  { path: 'tables', component: Containers.TablesComponent },
  { path: 'typography', component: Containers.TypographyComponent },
  { path: 'maps', component: Containers.MapsComponent },
  { path: 'blockchain', component: Containers.BlockchainComponent },
  { path: 'users', component: Containers.AdminUsersComponent },
  { path: 'notifications', component: Containers.NotificationsComponent },
  { path: 'usersetting/:id', component: Containers.UserSettingComponent }
];
