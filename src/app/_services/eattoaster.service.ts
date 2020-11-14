import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable()
export class EatToasterService {

    options: IndividualConfig;
    iconClasses: any;

    constructor(
        private toastr: ToastrService
    ) {
        this.options = this.toastr.toastrConfig;
        this.options.positionClass = 'toast-top-right';
        this.options.timeOut = 1500;
        this.iconClasses = {
            error: 'error',
            info: 'info',
            success: 'success',
            warning: 'warning',
        };
    }



    showToast(title, message, type) {
        this.toastr.show(message, title, this.options, 'toast-' + type);
    }

}

