import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';


@Injectable()
export class AuthService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email: email, password: password })
            .pipe(
                map(result => {
                    console.log("token2 =======", result);
                    localStorage.setItem('access_token', result.token);
                    return result;
                })
            );
    }
    logout() {
        localStorage.removeItem('access_token');
    }

    public get loggedIn(): boolean {
        return (localStorage.getItem('access_token') !== null);
    }

    public getToken(): string {
        return localStorage.getItem('access_token');
    }

    verifyToken(token) {
        return this.http.post(`${environment.apiUrl}/authenticate/verifyToken`,
            {
                token: token
            });
    }

}
