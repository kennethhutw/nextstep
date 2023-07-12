import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

import * as moment from 'moment';
// export class NotificationCacheService {

//     readonly CACHE_DURATION_IN_MINUTES = 3;

//     private cache: {
//         expires: Date,
//         userId: string,
//         value: Observable<any[]>
//     } = null as any;
//     constructor(
//     ) {
//     }

//     getValue(userId): Observable<any[]> {
//         if (!this.cache) {
//             return null as any;
//         }

//         if (!this.cache.userId != userId) {
//             return null as any;
//         }

//         if (moment(new Date()).isAfter(this.cache.expires)) {
//             return null as any;
//         }

//         return this.cache.value;
//     }

//     setValue(value: Observable<any[]>, userId: string) {
//         this.cache = {
//             value,
//             userId,
//             expires: moment(new Date()).add(this.CACHE_DURATION_IN_MINUTES, 'minutes').toDate()
//         };

//     }

//     clearCache() {
//         this.cache = null as any;
//     }
// }

@Injectable()
export class NotificationService {

    types: any;
    constructor(private http: HttpClient) {
        this.types = {
            user: 'user',
            mentor: 'mentor',
            project: 'project',
            application: 'application',
        };
    }

    getall() {
        return this.http.get(`${environment.apiUrl}/notifications`);
    }

    async getNotifications(uid: string) {
        return await this.http.get(`${environment.apiUrl}/notifications/${uid}`, {}).toPromise();
    }

    async getFirstFiveNotifications(uid: string) {
        return await this.http.get(`${environment.apiUrl}/notifications/firstFive/${uid}`, {}).toPromise();
    }

    async insert(receiver_id,
        sender_id,
        content,
        type,
        isRead,
        status,
        uid) {
        return await this.http.post(`${environment.apiUrl}/notifications`, {
            receiver_id,
            sender_id,
            content,
            type,
            isRead,
            status,
            uid
        }).toPromise();
    }

    async infoProjectMembers(projectId,
        sender_id,
        content,
        type,
        isRead,
        status,
        uid) {
        return await this.http.post(`${environment.apiUrl}/notifications/project/${projectId}`, {
            sender_id,
            content,
            type,
            isRead,
            status,
            uid
        }).toPromise();
    }

    allread(uid: string) {
        return this.http.put(`${environment.apiUrl}/notifications/allread/${uid}`, {
        });
    }
}
