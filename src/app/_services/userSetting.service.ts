import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "./../../environments/environment";
import { resResult } from "../_models";

@Injectable()
export class UserSettingService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get(`${environment.apiUrl}/usersetting/`, {});
    }

    async getByUserId(userId: string) {

        return await this.http
            .get<any>(`${environment.apiUrl}/usersetting/user/${userId}`, {
            })
            .toPromise();
    }

    update(params) {
        return this.http.put(`${environment.apiUrl}/usersetting/user`, params);
    }

    resetPassword(userId, params) {
        return this.http.put(`${environment.apiUrl}/users/resetPassword/${userId}`, params);
    }
}
