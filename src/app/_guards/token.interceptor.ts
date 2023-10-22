import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { ErrorDialogService } from "../_shared/errors/error-dialog.service";
import { LoadingDialogService } from "../_shared/loading/loading-dialog.service";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(

        private errorDialogService: ErrorDialogService,
        private loadingDialogService: LoadingDialogService) { }
    intercept(request: HttpRequest<any>,
        next: HttpHandler):
        Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                Authorization: `NEXTSTEP ${localStorage.getItem('access_token')}`
            }
        });

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
