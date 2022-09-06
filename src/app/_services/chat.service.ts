import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";
@Injectable()
export class ChatService {
    constructor(private http: HttpClient) { }

    getUserChatRecord(uid, to_uid) {
        const params = new HttpParams().set('uid', uid).set('to_uid', to_uid);
        return this.http.get<any>(`${environment.apiUrl}/chat`,
            {
                params: params
            });
    }

    async getConversations(uid) {

        return await this.http.get<any>(`${environment.apiUrl}/chat/conversations/${uid}`,
        ).toPromise();
    }

    get(uid, to_uid) {
        return this.http.get<any>(`${environment.apiUrl}/chat`
        );
    }

    insert(params) {
        return this.http.post(`${environment.apiUrl}/chat`, params);
    }

    read(uid, to_uid) {
        return this.http.put(`${environment.apiUrl}/chat/read`, {
            uid,
            to_uid
        });
    }




}
