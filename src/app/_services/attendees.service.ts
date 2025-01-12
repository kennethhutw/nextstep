import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "./../../environments/environment";
import { resResult } from "../_models";

const serviceName = 'attendees';

@Injectable()
export class AttendeeService {
    constructor(private http: HttpClient) { }

    getAllUser() {
        return this.http.get(`${environment.apiUrl}/${serviceName}/all`, {});
    }


    async getByEmail(email: string) {
        const params = new HttpParams().set("email", email);
        return await this.http
            .get<any>(`${environment.apiUrl}/${serviceName}/email`, {
                params: params,
            })
            .toPromise();
    }

    async getUserBasicInfo(id: string) {
        return await this.http
            .get<any>(`${environment.apiUrl}/${serviceName}/${id}`)
            .toPromise();
    }





    async getPublicAttendees(userId: string) {
        const params = new HttpParams().set("userId", userId);
        return await this.http
            .get<any>(`${environment.apiUrl}/${serviceName}/publicAttendess`, {
                params: params,
            })
            .toPromise();
    }


    public insert(data) {
        return this.http
            .post<resResult>(`${environment.apiUrl}/${serviceName}`,
                data
            );
    }



    public updateInfo(id, data) {
        return this.http
            .put<resResult>(`${environment.apiUrl}/${serviceName}/${id}`,
                data
            );
    }



    deleteUser(id: string, uid: string) {
        return this.http.delete(`${environment.apiUrl}/${serviceName}/${id}/${uid}`, {});
    }


}
