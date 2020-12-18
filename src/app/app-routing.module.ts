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
  ArtistUploadComponent
} from "./pages";

import {
  ArtistLayoutComponent,
  CollectorLayoutComponent
} from "./layout";
const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },
  { path: "login", component: LogInComponent },
  { path: "example", component: ExampleComponent },
  { path: "artists", component: ArtistsComponent },
  { path: "newArtist", component: NewArtistComponent },
  // { path: "artist/:name", component: ArtistPageComponent },
  { path: "activity", component: ActivityComponent },
  { path: "gallery/:editionId", component: EditionComponent },
  { path: "gallery", component: GalleryComponent },
  { path: "error", component: ErrorComponent },
  { path: "profile/artist/:id", component: ArtistProfileComponent },
  { path: "profile/collector/:id", component: CollectorProfilePageComponent },
  { path: "donation", component: DonationComponent },
  { path: "edition", component: EditionComponent },
  { path: "qa",component:QAComponent},
  { path: "policy",component:PolicyComponent},
  { path: "about",component:AboutComponent},
  { path: "for-artist",component:ForArtistComponent},
  { path: "for-buyer",component:ForBuyerComponent},
  { path: "token/:id", component: TokenComponent },
  { path: "artist",
    component: ArtistLayoutComponent,
    children:[{
        path: "account",
        component: ArtistAccountComponent,
      },{
        path: "collection",
        component: ArtistCollectionComponent,
      },{
        path: "favorite",
        component: ArtistFavoriteComponent,
      },{
        path: "offer",
        component: ArtistOfferComponent,
      },{
        path: "sales",
        component: ArtistSalesComponent,
      },{
        path: "basic",
        component: ArtistBasicComponent,
      },{
        path: "detail",
        component: ArtistEditionDetailComponent,
      },{
        path: "upload",
        component: ArtistUploadComponent,
      }]
  },
  { path: "collector",
    component:CollectorLayoutComponent,
    children:[{
        path: "account",
        component: CollectorAccountComponent,
      },{
        path: "collection",
        component: CollectorCollectionComponent,
      },{
        path: "favorite",
        component: CollectorFavoriteComponent,
      },{
        path: "offer",
        component: CollectorOfferComponent,
      },{
        path: "sales",
        component: CollectorSalesComponent,
      }]
  },
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
