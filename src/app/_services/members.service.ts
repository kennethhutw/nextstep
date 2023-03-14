import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class MembersService {
    constructor(private http: HttpClient) { }

    getall() {
        return this.http.get(`${environment.apiUrl}/projects`);
    }

    async insertMember(params) {
        return await this.http.post(`${environment.apiUrl}/members`, params).toPromise();
    }

    async apply(params) {
        return await this.http.post(`${environment.apiUrl}/members/application`, params).toPromise();
    }

    async update(id, params) {
        return await this.http.put(`${environment.apiUrl}/members/${id}`, params).toPromise();
    }

    async delete(id, userId) {
        return await this.http.delete(`${environment.apiUrl}/members/${id}/${userId}`,
            {
            }).toPromise();;
    }
}
