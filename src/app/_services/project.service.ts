import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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

    async getProject(id: string) {

        return await this.http
            .get<any>(`${environment.apiUrl}/projects/${id}`, {
            })
            .toPromise();
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/projects/${id}`, params);
    }

    async getMembers(projectId: string) {
        // const params = new HttpParams().set("uid", uid);
        return await this.http
            .get<any>(`${environment.apiUrl}/members/getByProjectId/${projectId}`, {
            })
            .toPromise();
    }

}
