import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class ViewsService {
    constructor(private http: HttpClient) { }
    async getIPAddress() {
        return await this.http.get("https://api.ipify.org/?format=json").toPromise();
    }

    async insert(viewedId,
        type,
        viewerId,
        ipaddress,
        uid) {

        return await this.http.post(`${environment.apiUrl}/view`, {
            viewedId,
            type,
            viewerId,
            ipaddress,
            uid
        }).toPromise();
    }

    async collect(collected_id,
        type,
        uid) {

        return await this.http.post(`${environment.apiUrl}/collect`, {
            collected_id,
            type,
            uid
        }).toPromise();
    }

    async unCollect(followed_id,
        type,
        uid) {
        let httpParams = new HttpParams().set('followed_id', followed_id);
        httpParams.set('type', type);
        httpParams.set('uid', uid);

        let options = { params: httpParams };
        return await this.http.delete(`${environment.apiUrl}/collect`, options).toPromise();
    }

    async follow(followed_id,
        type,
        uid) {

        return await this.http.post(`${environment.apiUrl}/follow`, {
            followed_id,
            type,
            uid
        }).toPromise();
    }

    async unFollow(followed_id,
        type,
        uid) {
        let httpParams = new HttpParams().set('followed_id', followed_id);
        httpParams.set('type', type);
        httpParams.set('uid', uid);

        let options = { params: httpParams };
        return await this.http.delete(`${environment.apiUrl}/follow`, options).toPromise();
    }
}
