import { RouterModule, Routes, UrlSerializer } from "@angular/router";

import {

  ImportMnemonicComponent,

} from "./wallet";


import * as Pages from './pages';
import * as AppLayouts from "./layout";
import * as Websitepages from './website/index';
import { AuthGuard } from './_guards';


const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },
  { path: "example", component: Pages.ExampleComponent, pathMatch: "full" },
  { path: "forgot", component: Websitepages.ForgotComponent },
  { path: "signup", component: Websitepages.SignupComponent },
  { path: "signin", component: Websitepages.SigninComponent },
  { path: "info", component: Websitepages.SignupInfoComponent },
  {
    path: "index",
    component: Pages.HomeComponent,
  },
  {
    path: "",
    component: AppLayouts.MainLayoutComponent,
    children: [
      { path: "projects", component: Pages.FindProjectComponent },
      { path: "members", component: Pages.FindMemberComponent },
      { path: "mentors", component: Pages.FindMentorComponent },
      { path: "profile/:userId", component: Pages.ProfileComponent },
      { path: "u/:userId", component: Pages.PubProfileComponent },
      {
        path: "checkStatus",
        component: Pages.CheckStatusComponent
      },
      {
        path: "verifyEmail",
        component: Pages.VerificationComponent
      },
      {
        path: "setPassword",
        component: Pages.SetPasswordComponent
      },
      {
        path: "settings",
        component: Pages.SettingsComponent
      }, {
        path: "notifications",
        component: Pages.NotificationsComponent
      },
      {
        path: "qa",
        component: Pages.QAComponent,
        pathMatch: "full"
      },
      {
        path: "notfound",
        component: Pages.PageNotFoundComponent,
      },
      {
        path: "feedback",
        component: Pages.FeedbackComponent,
        pathMatch: "full"
      },
      { path: "policy", component: Pages.PolicyComponent, pathMatch: "full" },
      { path: "about", component: Pages.AboutComponent, pathMatch: "full" },

      { path: "error", component: Pages.ErrorComponent, pathMatch: "full" },
      { path: "login", component: Pages.LoginComponent },
      { path: "newProject", component: Pages.newProjectComponent, pathMatch: "full" },
      { path: "", redirectTo: "index", pathMatch: "full" }
    ],
  },
  { path: "page-not-found", component: ImportMnemonicComponent },
  {
    path: 'admin',
    component: AppLayouts.AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './admin/admin.module#AdminLayoutModule'
      }
    ]
  },
  { path: '**', redirectTo: 'index' }
];


export const routing = RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'top'
});
