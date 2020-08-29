import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /*     if (request.url.indexOf('https://pro-api.coinmarketcap.com') == -1) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Crypto ${this.auth.getToken()}`
                    }
                });
            } */
        console.log(request);
        return next.handle(request);
    }
}