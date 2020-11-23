import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes, UrlSerializer } from "@angular/router";

import { LogInComponent } from "./login/log-in/log-in.component";
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
} from "./pages";

const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },
  { path: "login", component: LogInComponent },
  { path: "example", component: ExampleComponent },
  { path: "artists", component: ArtistsComponent },
  { path: "artist", component: ArtistProfileComponent },
  { path: "newArtist", component: NewArtistComponent },
  { path: "artist/:name", component: ArtistProfileComponent },
  { path: "activity", component: ActivityComponent },
  { path: "gallery", component: GalleryComponent },
  { path: "profile", component: ProfileComponent },
  { path: "donation", component: DonationComponent },
  { path: "edition", component: EditionComponent },
  { path: "token/:id", component: TokenComponent },
  {
    path: "index",
    component: HomeComponent,
    children: [
      {
        path: "notfound",
        component: PageNotFoundComponent,
      },
    ],
  },
  { path: "register-artist", component: RegisterArtistComponent },
  { path: "register-collector", component: RegisterBuyerComponent },
  { path: "wallet/new-wallet", component: NewWalletComponent },
  { path: "wallet/walletlist", component: WalletListComponent },
  { path: "wallet/import-wallet", component: ImportWalletComponent },
  { path: "wallet/create-wallet", component: CreateWalletComponent },
  { path: "wallet/success", component: SuccessComponent },
  { path: "wallet/private-key", component: PrivateKeyComponent },
  { path: "wallet/without-private-key", component: WithoutPrivateKeyComponent },
  { path: "wallet/metamask", component: MetamaskComponent },
  { path: "wallet/importAddress", component: ImportAddressComponent },
  { path: "wallet/importMnemonic", component: ImportMnemonicComponent },
  { path: "page-not-found", component: ImportMnemonicComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      malformedUriErrorHandler: (
        error: URIError,
        urlSerializer: UrlSerializer,
        url: string
      ) => urlSerializer.parse("/page-not-found"),
    }),
  ],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
