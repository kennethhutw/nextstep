import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class WorkService {
    constructor(private http: HttpClient) { }
    async getIPAddress() {
        return await this.http.get("https://api.ipify.org/?format=json").toPromise();
    }

    async insert(projectId,
        text,
        link,
        isPublic,
        uid) {

        return await this.http.post(`${environment.apiUrl}/work`, {
            projectId,
            text,
            link,
            isPublic,
            uid
        }).toPromise();
    }

    async update(id, params) {
        return await this.http.put(`${environment.apiUrl}/work/${id}`, params).toPromise();
    }

    async getWork(id) {

        return await this.http.get(`${environment.apiUrl}/work/${id}`, {
        }).toPromise();
    }

    async getWorks(projectId) {

        return await this.http.get(`${environment.apiUrl}/work/project/${projectId}`, {
        }).toPromise();
    }


    async delete(id) {
        let httpParams = new HttpParams().set('id', id);

        let options = { params: httpParams };
        return await this.http.delete(`${environment.apiUrl}/work/${id}`, options).toPromise();
    }
}
