import { NgModule, ErrorHandler } from "@angular/core";
import { LoadingDialogComponent } from "./_shared/loading/loading-dialog/loading-dialog.component";
import { ErrorDialogComponent } from "./_shared/errors/error-dailog/error-dialog.component";
import { ErrorDialogService } from "./_shared/errors/error-dialog.service";
import { LoadingDialogService } from "./_shared/loading/loading-dialog.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";


import { AuthService, TokenInterceptor } from "./_guards";
import { Utility, SocialMediaUtility, TimeUtility } from "./_helpers";
import { BsModalService } from "ngx-bootstrap/modal";

import { GlobalErrorHandler } from "./_core/errors/global-error-handler";
import { LoadingSpinnerComponent } from "./_shared/loading-spinner/loading-spinner.component";
import { NgxSpinnerModule } from "ngx-spinner";
import {
    UserService,

    DataService,
    AuthStore,
    AppSettingsService,
    DialogService,
    SettingService,
    LikeService,
    EmailService
} from "./_services";

@NgModule({
    providers: [
        Utility,
        TimeUtility,
        SocialMediaUtility,
        ErrorDialogService,
        LoadingDialogService,
        BsModalService,
        UserService,

        AuthService,

        DataService,
        AppSettingsService,
        AuthStore,
        LikeService,

        SettingService,
        DialogService,
        EmailService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
    ]
})

export class CoreModule { }
