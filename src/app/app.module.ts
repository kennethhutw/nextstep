import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
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

import { TooltipModule, TooltipConfig } from 'ngx-bootstrap/tooltip';

import {
  FooterComponent,
  HeaderComponent,

  ProfileEditorComponent,
  NavbarComponent,
  SidebarComponent,
  AdminFooterComponent,
} from "./components";

import {
  GoogleLoginProvider,
  FacebookLoginProvider,

} from "angularx-social-login";
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
// Configs

const googleLoginOptions = {
  scope: 'profile email',
  plugin_name: 'sample_login' //can be any name
};


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
import {
  GoogleAnalyticsService,
  AppSettingsService
} from "./_services";
import { SwiperModule } from 'swiper/angular';
import { TagInputModule } from 'ngx-chips';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbRatingModule
} from '@ng-bootstrap/ng-bootstrap';

export function createLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function appConfigFactory(provider: AppSettingsService) {

  return () => provider.init();
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
    SocialLoginModule,
    TagInputModule,
    SwiperModule,
    TooltipModule.forRoot(),
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbRatingModule
  ],
  providers: [
    GoogleAnalyticsService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1093364473991-70t3haupsjd78sekbn2lkjrqlb5oo6c8.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('4372722732764052')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,

    },
    AppSettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigFactory,
      deps: [AppSettingsService],
      multi: true
    },
    {
      provide: TooltipConfig,
      useFactory: () => Object.assign(new TooltipConfig(), { container: 'body', placement: 'bottom' }),
    },],
  bootstrap: [AppComponent],
})
export class AppModule { }
