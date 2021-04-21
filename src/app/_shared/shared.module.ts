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
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { NgxSpinnerModule } from "ngx-spinner";

import * as AppServices from "./../_services";

import {
  UploadFileComponent,
  ModalComponent,
  DragDropFileDirective,
  DialogComponent,
  EditableInputComponent,
  ViewModeDirective,
  EditModeDirective,
  EditableOnEnterDirective,
  LoadingComponent
} from "../components";

import {
  FocusableDirective,

} from "../_directive";

import {
  AddressShortenPipe,
  ShortenPipe,
  UserFilterPipe
} from "../_pipe";

const sharedComponents = [
  LoadingSpinnerComponent,
  LoadingDialogComponent,
  ErrorDialogComponent,
  LoadingComponent];

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
    UserFilterPipe,
    ...sharedComponents,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgxSpinnerModule,


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
    UserFilterPipe,
    ...sharedComponents,
  ],
  providers: [
    Utility,
    TimeUtility,
    SocialMediaUtility,
    ErrorDialogService,
    LoadingDialogService,
    BsModalService,
    AuthService,
    ...AppServices.services,
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
