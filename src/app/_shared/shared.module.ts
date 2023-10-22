import {
  NgModule, ErrorHandler,
  NO_ERRORS_SCHEMA
  , CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";

import { ErrorDialogService } from "./errors/error-dialog.service";
import { LoadingDialogService } from "./loading/loading-dialog.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from "./../_guards";
import { Utility, SocialMediaUtility, TimeUtility } from "../_helpers";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";

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
import { HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function createLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createLoader,
        deps: [HttpClient],
      },
    }),
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
    TranslateModule,
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
