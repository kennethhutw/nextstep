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
  { path: 'blockchain', component: Containers.BlockchainComponent },
  { path: 'users', component: Containers.AdminUsersComponent },
  { path: 'users/info/:id', component: Containers.UserInfoComponent },
  { path: 'notifications', component: Containers.NotificationsComponent },
  { path: 'usersetting/:id', component: Containers.UserSettingComponent },
  { path: 'application/:id', component: Containers.ApplicationComponent },
  { path: 'editions', component: Containers.AdminEditionComponent },
  { path: 'editions/tokenize/:id', component: Containers.TokenizeComponent },
  { path: 'editions/artworks/:editionId', component: Containers.AdminArtworkComponent },
  { path: 'delegate', component: Containers.AdminDelegateEmailComponent },
  { path: 'promo', component: Containers.AdminPromoComponent },
  { path: 'settings', component: Containers.AdminSettingsComponent },
];
