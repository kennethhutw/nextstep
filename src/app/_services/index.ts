import { UserService } from "./user.service";
import { DataService } from "./data.service";
import { AppSettingsService } from "./appSettings.service";
import { EmailService } from "./email.service";
import { AuthStore } from "./auth.store";
import { DialogService } from "./dialog.service";
import { SettingService } from "./setting.service";
import { LikeService } from "./like.service";

import { ToastService } from './toastr.service';
import { PendingEditionService } from './pendingedition.service';
import { DelegateEmailService } from './delegateEmail.service';
import { AdminService } from "./admin.service";
import { TableService } from "./table.service";
import { UserTourService } from './user-tour.service';
import { SeoService } from './seo.service';
import { ScrollService } from './scroll.service';
import { TxService } from './tx.service';
import { ProjectService } from './Project.service';

export const services = [
    AdminService,
    UserService,
    ProjectService,
    DataService,
    AppSettingsService,
    DialogService,
    SettingService,
    LikeService,

    EmailService,
    ToastService,
    PendingEditionService,
    DelegateEmailService,
    TableService,
    UserTourService,
    SeoService,
    ScrollService,
    TxService];



export * from "./user.service";

export { DataService } from "./data.service";
export { AppSettingsService } from "./appSettings.service";
export { EmailService } from "./email.service";
export { AuthStore } from "./auth.store";
export { DialogService } from "./dialog.service";
export { SettingService } from "./setting.service";
export { LikeService } from "./like.service";

export * from './toastr.service';
export { PendingEditionService } from './pendingedition.service';
export { DelegateEmailService } from './delegateEmail.service';
export { AdminService } from "./admin.service";
export { TableService } from "./table.service";
export { UserTourService } from './user-tour.service';
export { SeoService } from './seo.service';
export { GoogleAnalyticsService } from './google-analytics.service';
export { ScrollService } from './scroll.service';
export { TxService } from './tx.service';
export { ProjectService } from './Project.service';
