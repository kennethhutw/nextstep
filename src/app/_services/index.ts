import { UserService } from "./user.service";
import { DataService } from "./data.service";
import { AppSettingsService } from "./appSettings.service";
import { EmailService } from "./email.service";

import { DialogService } from "./dialog.service";
import { SettingService } from "./setting.service";
import { LikeService } from "./like.service";
import { MembersService } from "./members.service";
import { ToastService } from './toastr.service';
import { DelegateEmailService } from './delegateEmail.service';
import { AdminService } from "./admin.service";
import { TableService } from "./table.service";
import { UserTourService } from './user-tour.service';
import { UserSettingService } from './userSetting.service';
import { SeoService } from './seo.service';
import { ScrollService } from './scroll.service';
import { InvitationService } from './invitation.service';

import { ProjectService } from './Project.service';
import { RecruitService } from './recruit.service';


export const services = [
    AdminService,
    AppSettingsService,
    DataService,
    DialogService,
    DelegateEmailService,
    EmailService,
    InvitationService,
    ProjectService,
    RecruitService,
    LikeService,
    MembersService,
    TableService,
    ToastService,
    SeoService,
    ScrollService,
    SettingService,
    UserService,
    UserSettingService,
    UserTourService];



export * from "./user.service";
export * from "./appSettings.service";
export * from "./admin.service";
export * from "./email.service";
export * from './delegateEmail.service';
export * from "./data.service";
export * from "./dialog.service";
export * from "./setting.service";
export * from "./like.service";
export * from "./members.service";
export * from './toastr.service';
export * from "./table.service";
export * from './user-tour.service';
export * from './userSetting.service';
export * from './seo.service';
export * from './google-analytics.service';
export * from './scroll.service';
export * from './Project.service';
export * from './recruit.service';
export * from './invitation.service';
