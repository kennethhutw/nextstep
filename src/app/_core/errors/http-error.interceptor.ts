import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler, HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, finalize } from 'rxjs/operators';
import { ErrorDialogService } from "../../_shared/errors/error-dialog.service";
import { LoadingDialogService } from "../../_shared/loading/loading-dialog.service";
import { AuthStore } from "../../_services/auth.store";
import {
  Router,
} from "@angular/router";
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthStore,
    private router: Router,
    private errorDialogService: ErrorDialogService,
    private loadingDialogService: LoadingDialogService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingDialogService.openDialog();
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error from error interceptor", error);

        this.auth.logout();
        this.router.navigate(['/']);
        return throwError(error);
      }),
      finalize(() => {
        this.loadingDialogService.hideDialog();
      })
    ) as Observable<HttpEvent<any>>;
  }
}
