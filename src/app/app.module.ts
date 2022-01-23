import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

// https://www.npmjs.com/package/ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AppComponent } from "./app.component";
import { routing } from "./app-routing.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { TooltipModule } from 'ng2-tooltip-directive';

import {
  FooterComponent,
  HeaderComponent,
  SubTabComponent,
  SubTabsComponent,
  SubTableComponent,
  ProfileEditorComponent,
  NavbarComponent,
  SidebarComponent,
  AdminFooterComponent,
  CircleTimerComponent,
  StepDotComponent
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
        provider: new GoogleLoginProvider("1011219418037-iaktg7f1qo860efoq7h1nmpansh9acj4.apps.googleusercontent.com")
      },
      {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
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
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from "../environments/environment";
import { CountdownModule } from "ng2-countdown-timer";

import { GoogleAnalyticsService } from "./_services";

const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

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
    SubTabComponent,
    SubTabsComponent,
    SubTableComponent,
    ProfileEditorComponent,

    NavbarComponent,
    SidebarComponent,
    AdminFooterComponent,
    CircleTimerComponent,
    StepDotComponent,
    Websitepages.containers
  ],
  imports: [
    ModalModule,
    TooltipModule,
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
    CountdownModule,
    SocketIoModule.forRoot(config),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,

    }),
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
