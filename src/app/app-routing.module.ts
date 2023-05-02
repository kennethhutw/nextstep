import { RouterModule, Routes, UrlSerializer, } from "@angular/router";
import { Component, Type } from '@angular/core';
import * as Pages from './pages';
import * as AppLayouts from "./layout";
import * as Websitepages from './website/index';
import { AuthGuard, PendingChangesGuard } from './_guards';

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
  { path: "invitedSignup", component: Websitepages.InvitedSignupComponent },
  { path: "signin", component: Websitepages.SigninComponent },
  { path: "info", component: Websitepages.SignupInfoComponent },
  {
    path: "resetPassword",
    component: Websitepages.ResetPasswordComponent
  },
  {
    path: "index",
    component: Pages.HomeComponent,
  },
  {
    path: "",
    component: AppLayouts.MainLayoutComponent,
    children: [
      { path: "example", component: Pages.ExampleComponent },
      { path: "ranking", component: Pages.RankingComponent },
      { path: "templates", component: Pages.TemplatesComponent },
      { path: "projects", component: Pages.FindProjectComponent },
      { path: "project/:id", component: Pages.ProjectComponent },
      { path: "job/:id", component: Pages.JobComponent },
      { path: "joinproject/:id", component: Pages.JoinProjectComponent },
      { path: "members", component: Pages.FindMemberComponent },
      { path: "mentors", component: Pages.FindMentorComponent },
      { path: "messages", component: Pages.ChatComponent },
      { path: "profile/:userId", component: Pages.PubProfileComponent },
      { path: "u/:userId", component: Pages.PubProfileComponent },
      { path: "mentor/:userId", component: Pages.MentorProfileComponent },
      {
        path: "verifyEmail",
        component: Pages.VerificationComponent
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
      { path: "support", component: Pages.SupportComponent, pathMatch: "full" },
      { path: "error", component: Pages.ErrorComponent, pathMatch: "full" },
      { path: "resources", component: Pages.ResourcesComponent },
      { path: "ideas", component: Pages.IdeasComponent },
      { path: "recruit", component: Pages.RecruitComponent },
      {
        path: "newProject",
        component: Pages.CreateProjectComponent,
        canDeactivate: [PendingChangesGuard]
      },
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
      {
        path: ':projectId/recruit',
        component: Pages.MyProjectRecruitComponent
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
