import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable()
export class RankingService {
    constructor(private http: HttpClient) { }



    getRanking() {
        return this.http.get(`${environment.apiUrl}/ranking`);
    }




}
