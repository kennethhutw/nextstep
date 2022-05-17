import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class NotificationService {
    constructor(private http: HttpClient) { }

    getall() {
        return this.http.get(`${environment.apiUrl}/notifications`);
    }

    async getNotifications(uid: string) {
        return await this.http.get(`${environment.apiUrl}/notifications/${uid}`, {}).toPromise();
    }

    async insertMember(params) {
        return await this.http.post(`${environment.apiUrl}/members`, params).toPromise();
    }


}
