import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class InvitationService {
    constructor(private http: HttpClient) { }

    getall() {
        return this.http.get(`${environment.apiUrl}/projects`);
    }

    async insert(params) {
        return await this.http.post(`${environment.apiUrl}/invitations/invite`, params).toPromise();
    }
    async inviteByUid(params) {
        return await this.http.post(`${environment.apiUrl}/invitations/inviteByUid`, params).toPromise();
    }

    async resend(params) {
        return await this.http.post(`${environment.apiUrl}/invitations/resend`, params).toPromise();
    }


    async getInvitingList(projectId) {
        return await this.http.get(`${environment.apiUrl}/invitations/inviting/${projectId}`).toPromise();
    }
    async delete(id) {
        return await this.http.delete(`${environment.apiUrl}/invitations/${id}`).toPromise();
    }

    async getInvitation(projectId, userId) {
        return await this.http.get(`${environment.apiUrl}/invitations/invitation/${projectId}/${userId
            }`).toPromise();
    }

    updateInvitation(id, params) {
        return this.http.put(`${environment.apiUrl}/invitations/${id}`, params);
    }

    rejectInvitation(id, params) {
        return this.http.put(`${environment.apiUrl}/invitations/reject/${id}`, params);
    }


    acceptJoinInvitation(id, params) {
        return this.http.put(`${environment.apiUrl}/invitations/join/${id}`, params);
    }

}
