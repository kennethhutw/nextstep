import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class TxService {
    constructor(private http: HttpClient) { }

    getTxs() {
        return this.http.get(`${environment.apiUrl}/transactions/getTxs`, {});
    }
}
