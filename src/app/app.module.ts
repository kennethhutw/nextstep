import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { LogInComponent } from "./login/log-in/log-in.component";
import { routing } from "./app-routing.module";

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
} from "./components";

import {
  ArtistLayoutComponent,
  CollectorLayoutComponent
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
  ProfileComponent,
  TokenComponent,
  NewArtistComponent,
  RegisterArtistComponent,
  PageNotFoundComponent,
  RegisterBuyerComponent,
  ArtistPageComponent,
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
ArtistSalesComponent,
ArtistBasicComponent,
ArtistEditionDetailComponent,
ArtistUploadComponent,

} from "./pages";

import { AnQrcodeModule } from "an-qrcode";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { OwlModule } from "ngx-owl-carousel";
// Import the library
import { IsotopeModule } from "ngx-isotope";
// Import NgMasonryGridModule
import { NgMasonryGridModule } from "ng-masonry-grid";

import { SharedModule } from "./_shared/shared.module";

export function createLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
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
    ProfileComponent,
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
    CollectorProfilePageComponent,
    QAComponent,
    PolicyComponent,
    AboutComponent,
    ForArtistComponent,
    ForBuyerComponent,
    ErrorComponent,
    ArtistHeaderComponent,
    CollectorHeaderComponent,
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
    ArtistSalesComponent,
    ArtistBasicComponent,
    ArtistEditionDetailComponent,
    ArtistUploadComponent,

  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AnQrcodeModule,
    OwlModule,
    IsotopeModule,
    NgMasonryGridModule,
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
export class AppModule {}
