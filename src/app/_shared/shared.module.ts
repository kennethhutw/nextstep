import { NgModule, ErrorHandler } from "@angular/core";
import { LoadingDialogComponent } from "./loading/loading-dialog/loading-dialog.component";
import { ErrorDialogComponent } from "./errors/error-dailog/error-dialog.component";
import { ErrorDialogService } from "./errors/error-dialog.service";
import { LoadingDialogService } from "./loading/loading-dialog.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService, TokenInterceptor } from "./../_guards";
import { Utility, SocialMediaUtility } from "../_helpers";
import { BsModalService } from "ngx-bootstrap/modal";
import { ModalModule } from "ngx-bootstrap";
import { GlobalErrorHandler } from "./../_core/errors/global-error-handler";
import {
  UserService,
  WalletService,
  CryptoService,
  Web3Service,
  ArtistService,
  EditionService,
  DataService,
AuthStore
} from "./../_services";

import {
  UploadFileComponent,
  ModalComponent,
  DragDropFileDirective,
} from "../components";
const sharedComponents = [LoadingDialogComponent, ErrorDialogComponent];

@NgModule({
  declarations: [
    UploadFileComponent,
    DragDropFileDirective,
    ModalComponent,
    ...sharedComponents,
  ],
  imports: [CommonModule, RouterModule, ModalModule.forRoot()],
  exports: [
    UploadFileComponent,
    DragDropFileDirective,
    ModalComponent,
    ...sharedComponents,
  ],
  providers: [
    Utility,
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
    EditionService,
    DataService,
    AuthStore,
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
export class SharedModule {}
