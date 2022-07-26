import { RouterModule, Routes, UrlSerializer, } from "@angular/router";
import { Component, Type } from '@angular/core';
import * as Pages from './pages';
import * as AppLayouts from "./layout";
import * as Websitepages from './website/index';
import { AuthGuard } from './_guards';

export function getHomeComponent(): Type<Component> {

  if (AuthGuard.prototype.canActivate) {

    return <Type<Component>>Pages.DashboardComponent;

  } else {

    return <Type<Component>>Pages.HomeComponent;

  }


}

const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },

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
      { path: "project/:id", component: Pages.ProjectComponent },
      { path: "job/:id", component: Pages.JobComponent },
      { path: "members", component: Pages.FindMemberComponent },
      { path: "mentors", component: Pages.FindMentorComponent },
      { path: "messages", component: Pages.ChatComponent },
      { path: "profile/:userId", component: Pages.PubProfileComponent },
      { path: "u/:userId", component: Pages.PubProfileComponent },

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
      { path: "recruit", component: Pages.RecruitComponent },
      { path: "newProject", component: Pages.newProjectComponent, pathMatch: "full" },
      { path: "", redirectTo: "index", pathMatch: "full" }
    ],
  },
  {
    path: 'myproject',
    component: AppLayouts.ProjectLayoutComponent,
    children: [
      {
        path: ':projectId/profile',
        component: Pages.MyProjectProfileComponent
      },
      {
        path: ':projectId/logs',
        component: Pages.MyProjectLogComponent
      },
      {
        path: ':projectId/settings',
        component: Pages.MyProjectSettingsComponent
      },
      {
        path: ':projectId/members',
        component: Pages.MyProjectMemberComponent
      },
      { path: ":projectId", component: Pages.MyProjectProfileComponent }
    ]
  },
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
  {
    path: 'dashboard',
    component: AppLayouts.SettingLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'myproject',
        component: Pages.MyProjectComponent
      },
      {
        path: "settings",
        component: Pages.SettingsComponent
      },
      {
        path: "notifications",
        component: Pages.NotificationsComponent
      },
      { path: "messages", component: Pages.ChatComponent },
      {
        path: 'myproject/:projectId',
        component: Pages.ProjectDetailComponent
      },
      {
        path: 'collection',
        component: Pages.MyCollectionComponent
      },
      {
        path: 'application',
        component: Pages.MyApplicationComponent
      },
      {
        path: '',
        component: Pages.DashboardComponent
      },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: 'index' }
];


export const routing = RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'top'
});
