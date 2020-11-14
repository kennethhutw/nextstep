import { Injectable } from "@angular/core";
import { 
    HttpInterceptor,
     HttpRequest,
      HttpHandler, HttpEvent,
       HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, finalize } from 'rxjs/operators';
import { ErrorDialogService } from "../../_shared/errors/error-dialog.service";
import { LoadingDialogService } from "../../_shared/loading/loading-dialog.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor{
  
    constructor(
        private errorDialogService: ErrorDialogService,
        private loadingDialogService: LoadingDialogService
      ) {}
    
      intercept(
        request: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
        this.loadingDialogService.openDialog();
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