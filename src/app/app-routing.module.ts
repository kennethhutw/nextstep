import { RouterModule, Routes, UrlSerializer } from "@angular/router";

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
  MainLayoutComponent,
  AdminLayoutComponent,
  ArtistLayoutComponent,
  CollectorLayoutComponent
} from "./layout";
const routes: Routes = [
  { path: "", redirectTo: "index" , pathMatch: "full"},
  { path: "example", component: ExampleComponent , pathMatch: "full"},
  { path: "donation", component: DonationComponent , pathMatch: "full"},
  { path: "edition", component: EditionComponent , pathMatch: "full"},
  { path: "qa",component:QAComponent , pathMatch: "full"},

  { path: "token/:id", component: TokenComponent },

  //  {
  //    path: "**",
  //    component: HomeComponent
  // },
   {
         path: "index",
         component: HomeComponent,
      },
   {
    path: "",
    component: MainLayoutComponent,
    children: [

      {
        path: "notfound",
        component: PageNotFoundComponent,
      },
      { path: "artists",
        component: ArtistsComponent,
        pathMatch: "full"
      },
      {
        path: "newArtist",
        component: NewArtistComponent,
        pathMatch: "full"
      },
      {
        path: "gallery",
        component: GalleryComponent,
        pathMatch: "full"},
      {
        path: "activity",
        component: ActivityComponent,
        pathMatch: "full"
      },
      {
        path: "gallery/:editionId",
        component: EditionComponent
      },
      { path: "policy",component:PolicyComponent, pathMatch: "full"},
      { path: "about",component:AboutComponent, pathMatch: "full"},
      { path: "for-artist",component:ForArtistComponent, pathMatch: "full"},
      { path: "for-buyer",component:ForBuyerComponent, pathMatch: "full"},
      { path: "error", component: ErrorComponent, pathMatch: "full" },
      { path: "profile/artist/:id", component: ArtistProfileComponent },
      { path: "profile/collector/:id", component: CollectorProfilePageComponent },
      {
        path: "artist",
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
            path: "collection/detail",
            component: ArtistEditionDetailComponent,
          },{
            path: "upload",
            component: ArtistUploadComponent,
          }]
      },
      {
        path: "collector",
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
        { path: "register-artist", component: RegisterArtistComponent },
        { path: "register-collector", component: RegisterBuyerComponent },

      { path: "", redirectTo: "index", pathMatch: "full" }
      ],
    },
  // {
  //   path: "index",
  //   component: HomeComponent,
  //   children: [
  //     {
  //       path: "notfound",
  //       component: PageNotFoundComponent,
  //     },
  //   ],
  // },

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

  {
    path: 'admin',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './admin/admin.module#AdminLayoutModule'
      }
    ]
  },
   { path: ":name", component: ArtistPageComponent},
];

// @NgModule({
//   imports: [
//     CommonModule,
//     RouterModule.forRoot(routes,{
//       malformedUriErrorHandler :(
//         error: URIError,
//         urlSerializer: UrlSerializer,
//         url: string
//        ) => urlSerializer.parse("/page-not-found"),
//     }),
//   ],
//   declarations: [],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
// export const AppRoutingModule = RouterModule.forRoot(routes, {
//   scrollPositionRestoration: 'top',
//     malformedUriErrorHandler :(
//          error: URIError,
//          urlSerializer: UrlSerializer,
//          url: string
//         ) => urlSerializer.parse("/page-not-found"),
// });
export const routing = RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'top'
});
