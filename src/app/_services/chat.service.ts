import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";
@Injectable()
export class ChatService {
    constructor(private http: HttpClient) { }

    async getUserChatRecord(uid) {
        return await this.http.get(`${environment.apiUrl}/chat/${uid}`,
            {

            }).toPromise;
    }




}
