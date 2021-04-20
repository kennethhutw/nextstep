import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { routing } from "./app-routing.module";
import { NgxSpinnerModule } from "ngx-spinner";
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
  ArtistDetailComponent,
  ArtistHeaderComponent,
  CollectorHeaderComponent,
  NavbarComponent,
  SidebarComponent,
  AdminFooterComponent
} from "./components";

import {
  AdminLayoutComponent,
  ArtistLayoutComponent,
  CollectorLayoutComponent,
  MainLayoutComponent
} from "./layout";

import { DisqusModule } from "ngx-disqus";

import {
  DonationComponent,
  HomeComponent,
  ExampleComponent,
  EditionComponent,
  ArtistsComponent,
  ArtistProfileComponent,
  ActivityComponent,
  GalleryComponent,

  TokenComponent,
  NewArtistComponent,
  RegisterArtistComponent,
  PageNotFoundComponent,
  RegisterBuyerComponent,
  ArtistPageComponent,
  CollectorPageComponent,
  CollectorProfilePageComponent,
  QAComponent,
  PolicyComponent,
  AboutComponent,
  ForArtistComponent,
  ForBuyerComponent,
  ErrorComponent,
  CollectorAccountComponent,
  CollectorCollectionComponent,
  CollectorFavoriteComponent,
  CollectorOfferComponent,
  CollectorSalesComponent,
  ArtistAccountComponent,
  ArtistCollectionComponent,
  ArtistFavoriteComponent,
  ArtistOfferComponent,
  ArtistSoldArtWorkComponent,
  ArtistBasicComponent,
  ArtistEditionDetailComponent,
  ArtistUploadComponent,
  VerificationComponent,
  SetPasswordComponent,
  CheckStatusComponent
} from "./pages";


import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AnQrcodeModule } from "an-qrcode";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";



import { SharedModule } from "./_shared/shared.module";

export function createLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
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
    DonationComponent,
    HomeComponent,
    ArtistsComponent,
    ArtistProfileComponent,
    ExampleComponent,
    EditionComponent,
    ArtWorkComponent,
    ArtWorkLogoComponent,
    HeaderComponent,
    FooterComponent,
    SubTabComponent,
    SubTabsComponent,
    SubTableComponent,
    ProfileEditorComponent,
    ActivityComponent,
    GalleryComponent,
    TokenComponent,
    ArtistComponent,
    NewArtistComponent,
    Edition1Component,
    Edition2Component,
    Edition3Component,
    RegisterArtistComponent,
    PageNotFoundComponent,
    RegisterBuyerComponent,
    ArtistDetailComponent,
    ArtistPageComponent,
    CollectorPageComponent,
    CollectorProfilePageComponent,
    QAComponent,
    PolicyComponent,
    AboutComponent,
    ForArtistComponent,
    ForBuyerComponent,
    ErrorComponent,
    ArtistHeaderComponent,
    CollectorHeaderComponent,
    AdminLayoutComponent,
    ArtistLayoutComponent,
    CollectorLayoutComponent,
    CollectorAccountComponent,
    CollectorCollectionComponent,
    CollectorFavoriteComponent,
    CollectorOfferComponent,
    CollectorSalesComponent,
    ArtistAccountComponent,
    ArtistCollectionComponent,
    ArtistFavoriteComponent,
    ArtistOfferComponent,
    ArtistSoldArtWorkComponent,
    ArtistBasicComponent,
    ArtistEditionDetailComponent,
    ArtistUploadComponent,
    NavbarComponent,
    SidebarComponent,
    AdminFooterComponent,
    VerificationComponent,
    SetPasswordComponent,
    CheckStatusComponent
  ],
  imports: [
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createLoader,
        deps: [HttpClient],
      },
    }),
    DisqusModule.forRoot("disqus_shortname"),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
