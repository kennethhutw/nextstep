import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    DialogService
} from '../_services';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(private dialogSrv: DialogService) {

    }
    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> | Promise<boolean> {
        // if there are no pending changes, just allow deactivation; else confirm first

        return component.canDeactivate() ?
            true : confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
        // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        // confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
    }

    async checkAuthentication(): Promise<boolean> {
        // Implement your authentication in authService
        return await this.dialogSrv.confirmThis("您有未保存的更改。 按取消返回並保存這些更改，或按確定放棄這些更改。 ",
            () => {
                return true;
            }, () => {
                return false;
            });

    }
}
