import { NgModule, ErrorHandler } from "@angular/core";

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
import { NgxSpinnerModule } from "ngx-spinner";

import * as AppServices from "./../_services";
import { AuthGuard, PendingChangesGuard } from './../_guards';

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
  NgbdSortableHeader
} from "../_directive";

import
  * as Pipes from "../_pipe";



import * as sharedComponents from "./../_shared"


@NgModule({
  declarations: [
    UploadFileComponent,
    DragDropFileDirective,
    ViewModeDirective,
    EditModeDirective,
    EditableOnEnterDirective,
    FocusableDirective,
    NgbdSortableHeader,
    DialogComponent,
    ModalComponent,
    EditableInputComponent,
    ...Pipes.pipes,
    LoadingComponent,
    ...sharedComponents.components,
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
    NgbdSortableHeader,
    DialogComponent,
    ModalComponent,
    EditableInputComponent,
    ...Pipes.pipes,
    LoadingComponent,
    ...sharedComponents.components,
  ],
  providers: [
    AuthGuard,
    PendingChangesGuard,
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
  entryComponents: [...sharedComponents.components],
})
export class SharedModule { }
