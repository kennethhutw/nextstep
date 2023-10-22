import { NgModule, ErrorHandler } from "@angular/core";
import { ErrorDialogService } from "./_shared/errors/error-dialog.service";
import { LoadingDialogService } from "./_shared/loading/loading-dialog.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./_guards";
import { Utility, SocialMediaUtility, TimeUtility } from "./_helpers";
import { BsModalService } from "ngx-bootstrap/modal";
import { GlobalErrorHandler } from "./_core/errors/global-error-handler";

import {
    UserService,
    DataService,
    AppSettingsService,
    DialogService,
    SettingService,
    LikeService,
    EmailService
} from "./_services";
import {
    AuthStore
} from "./_services/auth.store";

@NgModule({
    providers: [
        Utility,
        TimeUtility,
        SocialMediaUtility,
        ErrorDialogService,
        LoadingDialogService,
        BsModalService,
        UserService,
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
