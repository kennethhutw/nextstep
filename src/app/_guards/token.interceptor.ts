import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { ErrorDialogService } from "../_shared/errors/error-dialog.service";
import { LoadingDialogService } from "../_shared/loading/loading-dialog.service";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        public auth: AuthService,
        private errorDialogService: ErrorDialogService,
        private loadingDialogService: LoadingDialogService) { }
    intercept(request: HttpRequest<any>,
        next: HttpHandler):
        Observable<HttpEvent<any>> {
        /*     if (request.url.indexOf('https://pro-api.coinmarketcap.com') == -1) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Crypto ${this.auth.getToken()}`
                    }
                });
            } */
        //  console.log(request);
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error("Error from error interceptor", error);
                this.errorDialogService.openDialog(
                    error.message
                    , error.status);
                return throwError(error);
            }),
            finalize(() => {
                this.loadingDialogService.hideDialog();
            })
        ) as Observable<HttpEvent<any>>;
    }
}
