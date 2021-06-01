import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class PromoService {
    constructor(private http: HttpClient) { }

    getPromo(email, type) {
        return this.http.get(`${environment.apiUrl}/promo/code/${email}/${type}`);
    }

    getAllPromo() {
        return this.http.get(`${environment.apiUrl}/promo/getAllPromo`);
    }

    generateCode(type) {
        return this.http.post(`${environment.apiUrl}/promo/generateCode`,
            {
                type
            })
    }

    deleletCode(id) {
        return this.http.post(`${environment.apiUrl}/promo/deleteCode`,
            {
                id
            })
    }

    updateCode(id, email, userId) {
        return this.http.post(`${environment.apiUrl}/promo/updateCode`,
            {
                id,
                email,
                userId
            })
    }

    async checkCode(email, code) {
        return await this.http.post(`${environment.apiUrl}/promo/checkCode`,
            {
                email,
                code
            }).toPromise();
    }
    async IsExist(code) {
        return await this.http.get(`${environment.apiUrl}/promo/isExist/${code}`).toPromise();
    }

    getCount() {
        return this.http.get(`${environment.apiUrl}/promo/getCount`);
    }

    getQuota(userId) {
        return this.http.get(`${environment.apiUrl}/promo/getQuota/${userId}`);
    }

}
