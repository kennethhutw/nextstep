import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class ProjectService {
    constructor(private http: HttpClient) { }

    getall() {
        return this.http.get(`${environment.apiUrl}/projects`);
    }

    insertProject(params) {
        return this.http.post(`${environment.apiUrl}/projects`, params);
    }

    async getProjectsByUid(uid: string) {
        // const params = new HttpParams().set("uid", uid);
        return await this.http
            .get<any>(`${environment.apiUrl}/projects/projectsByUid/${uid}`, {

            })
            .toPromise();
    }


    async getProject(id: string, userId: string) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/projects/project/${id}`, {
                params: params
            })
            .toPromise();
    }

    async getPublicProjects(userId) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/projects/publicprojects`, {
                params: params
            })
            .toPromise();
    }

    async getMayInterestedProjects(userId) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/projects/mayinterestedprojects`, {
                params: params
            })
            .toPromise();
    }

    async getLandingProjects(userId) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/projects/landingproject`, {
                params: params
            })
            .toPromise();
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/projects/${id}`, params);
    }

    async getMembers(projectId: string) {
        // const params = new HttpParams().set("uid", uid);
        return await this.http
            .get<any>(`${environment.apiUrl}/members/project/${projectId}`, {
            })
            .toPromise();
    }

    async addMembers(projectId: string) {
        // const params = new HttpParams().set("uid", uid);
        return await this.http
            .post<any>(`${environment.apiUrl}/members/projectId/${projectId}`, {
            })
            .toPromise();
    }

    async updateMemberstatus(projectId: string, userId: string, status: string, uid: string) {

        return await this.http
            .put<any>(`${environment.apiUrl}/members/status`, {
                projectId,
                userId,
                status,
                uid
            })
            .toPromise();
    }

    updateImage(id, params) {
        return this.http.put(`${environment.apiUrl}/projects/profileImage/${id}`, params);
    }

    updateCover(id, params) {
        return this.http.put(`${environment.apiUrl}/projects/profileCover/${id}`, params);
    }

    async delete(id, uid) {
        return await this.http.delete(`${environment.apiUrl}/projects/${id}/${uid}`,
            {
            }).toPromise();;
    }


}
