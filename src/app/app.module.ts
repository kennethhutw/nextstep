import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

// https://www.npmjs.com/package/ng-circle-progress
import { AppComponent } from "./app.component";
import { routing } from "./app-routing.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { AngularSvgIconModule } from 'angular-svg-icon';

import {
  FooterComponent,
  HeaderComponent,

  ProfileEditorComponent,
  NavbarComponent,
  SidebarComponent,
  AdminFooterComponent,
} from "./components";

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider
} from "angular-6-social-login";
// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      // {
      //   id: FacebookLoginProvider.PROVIDER_ID,
      //   provider: new FacebookLoginProvider("4372722732764052")
      // },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("1093364473991-ti8uurvtqd8995s7smn31utnn4c2pttk.apps.googleusercontent.com")
      },
    ]
  );
  return config;
}

import * as AppComponents from "./components";

import * as AppLayouts from "./layout";

import * as Pages from './pages';

import * as Websitepages from './website/index';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AnQrcodeModule } from "an-qrcode";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "./_shared/shared.module";

import { ModalModule } from './_modal';
import { GoogleAnalyticsService } from "./_services";

export function createLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    ...Pages.containers,
    ...AppComponents.components,
    ...AppLayouts.layouts,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfileEditorComponent,

    NavbarComponent,
    SidebarComponent,
    AdminFooterComponent,
    Websitepages.containers
  ],
  imports: [
    ModalModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AnQrcodeModule,
    CollapseModule,
    NgxSpinnerModule,
    SharedModule,
    AngularSvgIconModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createLoader,
        deps: [HttpClient],
      },
    }),
    SocialLoginModule
  ],
  providers: [GoogleAnalyticsService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
