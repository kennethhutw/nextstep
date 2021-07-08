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
  NewWalletComponent,
  WalletListComponent,
  ImportWalletComponent,
  CreateWalletComponent,
  SuccessComponent,
  ImportAddressComponent,
  ImportMnemonicComponent,
  PrivateKeyComponent,
  WithoutPrivateKeyComponent,
  MetamaskComponent,
} from "./wallet";
import {
  ArtWorkComponent,
  ArtWorkLogoComponent,
  FooterComponent,
  HeaderComponent,
  SubTabComponent,
  SubTabsComponent,
  SubTableComponent,
  ProfileEditorComponent,
  ArtistComponent,
  Edition1Component,
  Edition2Component,
  Edition3Component,
  Edition4Component,
  Edition5Component,
  ArtistDetailComponent,
  CollectorDetailComponent,
  ArtistHeaderComponent,
  CollectorHeaderComponent,
  NavbarComponent,
  SidebarComponent,
  AdminFooterComponent,
  CircleTimerComponent,
  StepDotComponent
} from "./components";

import {
  AdminLayoutComponent,
  ArtistLayoutComponent,
  CollectorLayoutComponent,
  MainLayoutComponent
} from "./layout";

import { DisqusModule } from "ngx-disqus";


import * as Pages from './pages';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AnQrcodeModule } from "an-qrcode";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import * as Websitepages from './website/index';

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
    MainLayoutComponent,
    AppComponent,
    NewWalletComponent,
    WalletListComponent,
    ImportWalletComponent,
    CreateWalletComponent,
    SuccessComponent,
    PrivateKeyComponent,
    WithoutPrivateKeyComponent,
    MetamaskComponent,
    ImportAddressComponent,
    ImportMnemonicComponent,
    ArtWorkComponent,
    ArtWorkLogoComponent,
    HeaderComponent,
    FooterComponent,
    SubTabComponent,
    SubTabsComponent,
    SubTableComponent,
    ProfileEditorComponent,
    ArtistComponent,
    Edition1Component,
    Edition2Component,
    Edition3Component,
    Edition4Component,
    Edition5Component,
    ArtistDetailComponent,
    CollectorDetailComponent,
    ArtistHeaderComponent,
    CollectorHeaderComponent,
    AdminLayoutComponent,
    ArtistLayoutComponent,
    CollectorLayoutComponent,
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
    DisqusModule.forRoot("disqus_shortname"),
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule { }
