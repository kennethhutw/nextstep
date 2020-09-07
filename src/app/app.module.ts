import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { UserListComponent } from "./admin/user-list/user-list.component";
import { LogInComponent } from "./login/log-in/log-in.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  UserService,
  WalletService,
  CryptoService,
  Web3Service,
  ArtistService
} from "./_services";
import { AuthService } from "./_guards";
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
  ProfileEditorComponent, ArtistComponent
} from "./components";

import { DisqusModule } from "ngx-disqus";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../app/_guards";


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
  TokenComponent
} from "./pages";
import { AnQrcodeModule } from "an-qrcode";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { OwlModule } from "ngx-owl-carousel";
// Import the library
import { IsotopeModule } from "ngx-isotope";
// Import NgMasonryGridModule
import { NgMasonryGridModule } from "ng-masonry-grid";

export function createLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
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
    ArtistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AnQrcodeModule,
    OwlModule,
    IsotopeModule,
    NgMasonryGridModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createLoader,
        deps: [HttpClient],
      },
    }),
    DisqusModule.forRoot("disqus_shortname"),
  ],
  providers: [
    UserService,
    WalletService,
    AuthService,
    CryptoService,
    Web3Service,
    ArtistService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
