import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable()
export class InspirationService {
    constructor(private http: HttpClient) { }

    insert(title, content,
        category, type,
        metadata, tags,
        uid) {
        return this.http.post(`${environment.apiUrl}/inspiration`,
            {
                title,
                content,
                category,
                type,
                metadata,
                tags,
                uid
            });
    }

    async delete(id, uid) {
        return await this.http.delete(`${environment.apiUrl}/inspiration/${id}/${uid}`,
            {
            }).toPromise();;
    }

    update(id, title, detail, category, uid) {
        return this.http.put(`${environment.apiUrl}/inspiration/${id}`,
            {
                title,
                detail,
                category,
                uid
            });
    }

    getall() {
        return this.http.get(`${environment.apiUrl}/inspiration`);
    }

    getinspiration(uid: string) {
        return this.http.get(`${environment.apiUrl}/inspiration/${uid}`);
    }

    getinspirationByStatus(status) {
        const params = new HttpParams()
            .set('status', status);
        return this.http.get(`${environment.apiUrl}/inspiration/getinspirationByStatus`,
            { params: params }).toPromise();
    }

    async vote(action, user_id, inspiration_id) {
        return await this.http.post(`${environment.apiUrl}/inspiration/vote/${action}/${user_id}/${inspiration_id}`,
            {

            }).toPromise();
    }


    async unVote(action, user_id, inspiration_id) {
        return await this.http.post(`${environment.apiUrl}/inspiration/unvote/${action}/${user_id}/${inspiration_id}`,
            {

            });
    }



}
