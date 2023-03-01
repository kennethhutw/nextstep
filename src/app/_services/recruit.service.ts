import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class RecruitService {
    constructor(private http: HttpClient) { }

    getall() {
        return this.http.get(`${environment.apiUrl}/projects`);
    }

    insert(params) {
        return this.http.post(`${environment.apiUrl}/recruit`, params);
    }

    async getById(id: string, userId: string) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/recruit/${id}`, {
                params
            })
            .toPromise();
    }

    async getByProjectId(id: string) {

        return await this.http
            .get<any>(`${environment.apiUrl}/recruit/project/${id}`, {
            })
            .toPromise();
    }

    async get(userId) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/recruit`, {
                params
            })
            .toPromise();
    }


    async updateStatus(params) {

        return await this.http
            .put<any>(`${environment.apiUrl}/recruit/status`, params)
            .toPromise();
    }

    async update(id, params) {

        return await this.http
            .put<any>(`${environment.apiUrl}/recruit/${id}`, params)
            .toPromise();
    }


    async delete(id, user_id){
        return await this.http
            .delete(`${environment.apiUrl}/recruit/${id}/${user_id}` )
            .toPromise();

    }
}
