import { NgModule, ErrorHandler } from "@angular/core";
import { LoadingDialogComponent } from "./loading/loading-dialog/loading-dialog.component";
import { ErrorDialogComponent } from "./errors/error-dailog/error-dialog.component";
import { ErrorDialogService } from "./errors/error-dialog.service";
import { LoadingDialogService } from "./loading/loading-dialog.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, TokenInterceptor } from "./../_guards";
import { Utility, SocialMediaUtility, TimeUtility } from "../_helpers";
import { BsModalService } from "ngx-bootstrap/modal";
import { ModalModule } from "ngx-bootstrap";
import { GlobalErrorHandler } from "./../_core/errors/global-error-handler";
import {
  UserService,
  WalletService,
  CryptoService,
  Web3Service,
  ArtistService,
  ArtWorkService,
  EditionService,
  DataService,
  AuthStore,
  AppSettingsService,
  DialogService,
  SettingService,
  LikeService,
  GalleryService,
  OfferService
} from "./../_services";

import {
  UploadFileComponent,
  ModalComponent,
  DragDropFileDirective,
  DialogComponent,
  EditableInputComponent,
  ViewModeDirective,
  EditModeDirective,
  EditableOnEnterDirective
} from "../components";

import {
  FocusableDirective,

} from "../_directive";

import { AddressShortenPipe, ShortenPipe }
  from "../_pipe";

const sharedComponents = [
  LoadingDialogComponent,
  ErrorDialogComponent];

@NgModule({
  declarations: [
    UploadFileComponent,
    DragDropFileDirective,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    FocusableDirective,

    DialogComponent,
    ModalComponent,
    EditableInputComponent,
    AddressShortenPipe,
    ShortenPipe,
    ...sharedComponents,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ModalModule.forRoot()],
  exports: [
    UploadFileComponent,
    DragDropFileDirective,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    FocusableDirective,

    DialogComponent,
    ModalComponent,
    EditableInputComponent,
    AddressShortenPipe,
    ShortenPipe,
    ...sharedComponents,
  ],
  providers: [
    Utility,
    TimeUtility,
    SocialMediaUtility,
    ErrorDialogService,
    LoadingDialogService,
    BsModalService,
    UserService,
    WalletService,
    AuthService,
    CryptoService,
    Web3Service,
    ArtistService,
    ArtWorkService,
    EditionService,
    DataService,
    AppSettingsService,
    AuthStore,
    LikeService,
    OfferService,
    SettingService,
    DialogService,
    GalleryService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  entryComponents: [...sharedComponents],
})
export class SharedModule { }
