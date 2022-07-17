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


    async getById(id: string) {

        return await this.http
            .get<any>(`${environment.apiUrl}/recruit/${id}`, {
            })
            .toPromise();
    }

    async get() {

        return await this.http
            .get<any>(`${environment.apiUrl}/recruit`, {
            })
            .toPromise();
    }
}
