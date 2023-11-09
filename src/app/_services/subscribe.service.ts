import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class SubscribeService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(`${environment.apiUrl}/subscription`);
    }

    async getCount() {
        return await this.http.get(`${environment.apiUrl}/subscription/count`).toPromise();
    }

    insert(params) {
        return this.http.post(`${environment.apiUrl}/subscription`, params);
    }



    async getById(id: string) {

        return await this.http
            .get<any>(`${environment.apiUrl}/subscription/${id}`, {

            })
            .toPromise();
    }

    async getByProjectId(id: string) {

        return await this.http
            .get<any>(`${environment.apiUrl}/subscription/project/${id}`, {
            })
            .toPromise();
    }


    async get(userId) {
        const params = new HttpParams().set('userId', userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/subscription`, {
                params
            })
            .toPromise();
    }


    async getByUserId(userId, email) {
        const params = new HttpParams().set('email', email);
        return await this.http
            .get(`${environment.apiUrl}/subscription/u/${userId}`, {
                params
            })
            .toPromise();
    }

    async update(id, params) {

        return await this.http
            .put<any>(`${environment.apiUrl}/subscription/${id}`, params)
            .toPromise();
    }


    async delete(id, user_id) {
        return await this.http
            .delete(`${environment.apiUrl}/subscription/${id}/${user_id}`)
            .toPromise();

    }
}
