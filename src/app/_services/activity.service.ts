import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";
@Injectable()
export class ActivityService {
    constructor(private http: HttpClient) { }

    async getProjectActivityByProjectId(projectId) {
        return await this.http.get(`${environment.apiUrl}/activity/project/${projectId
            }`).toPromise();
    }

    async getUserActivityUserId(uid) {
        return await this.http.get(`${environment.apiUrl}/activity/user/${uid
            }`).toPromise();
    }

    insert(uid,
        projectId,
        event_type,
        action) {
        return this.http.post(`${environment.apiUrl}/activity`,
            {
                uid,
                projectId,
                event_type,
                action
            });
    }



}
