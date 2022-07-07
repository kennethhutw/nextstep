import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class LandingService {
    constructor(private http: HttpClient) { }

    async getall() {
        return await this.http.get(`${environment.apiUrl}/landing`).toPromise();
    }


}
