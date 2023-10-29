import { Injectable } from '@angular/core';
import {
    ToastrService,
    IndividualConfig
} from 'ngx-toastr';
import { TranslateService } from "@ngx-translate/core";
@Injectable()
export class ToastService {

    options: IndividualConfig;
    iconClasses: any;

    collectStr: string = "";
    uncollectStr: string = "";
    followingStr: string = "";
    unfollowingStr: string = "";
    successfulStr: string = "";
    failedStr: string = "";
    startfollowu: string = "";
    stopfollowu: string = "";
    startcollect: string = "";
    stopcollect: string = "";
    applysendsuc: string = "";
    applysendfailed: string = "";

    constructor(
        private toasterSrv: ToastrService,
    ) {
        this.options = this.toasterSrv.toastrConfig;
        this.options.positionClass = 'toast-top-right';
        this.options.timeOut = 1500;
        // this.options.disableTimeOut = true
        this.iconClasses = {
            error: 'error',
            info: 'info',
            success: 'success',
            warning: 'warning',
        };
    }

    changeLang(translateSrv: TranslateService) {
        translateSrv.get("SUCCESSFUL").subscribe((text: string) => {
            this.successfulStr = text;
        });

        translateSrv.get("FAILED").subscribe((text: string) => {
            this.failedStr = text;
        });


        translateSrv.get("FOLLOWED").subscribe((text: string) => {
            this.followingStr = text;
        });

        translateSrv.get("UNFOLLOW").subscribe((text: string) => {
            this.unfollowingStr = text;
        });

        translateSrv.get("COLLECTED").subscribe((text: string) => {
            this.collectStr = text;
        });

        translateSrv.get("UNCOLLECT").subscribe((text: string) => {
            this.uncollectStr = text;
        });

        translateSrv.get("STARTFOLLOWU").subscribe((text: string) => {
            this.startfollowu = text;
        });

        translateSrv.get("STOPFOLLOWU").subscribe((text: string) => {
            this.stopfollowu = text;
        });

        translateSrv.get("STARTCOLLECT").subscribe((text: string) => {
            this.startcollect = text;
        });

        translateSrv.get("APPLYSENDSUC").subscribe((text: string) => {
            this.applysendsuc = text;
        });

        translateSrv.get("APPLYSENDFAILED").subscribe((text: string) => {
            this.applysendfailed = text;
        });

        translateSrv.get("STOPCOLLECT").subscribe((text: string) => {
            this.stopcollect = text;
        });
    }



    showToast(title, message, type) {
        this.toasterSrv.show(message, title, this.options, 'toast-' + type);
    }

    showToast2(title, message) {
        this.toasterSrv.show(message, title, this.options);
    }

}
