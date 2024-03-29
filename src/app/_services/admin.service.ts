import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";
@Injectable()
export class AdminService {
    constructor(private http: HttpClient) { }

    public getAllArtists(): Observable<any> {
        return this.http
            .get("../../assets/data/artists.json")
            .pipe(retry(3), catchError(this.handleError));
    }

    handleError(err) {
        let errorMessage = "";
        if (err.error instanceof ErrorEvent) {
            errorMessage = `Error: ${err.message}`;
        } else {
            errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
            console.error(errorMessage);
            return throwError(errorMessage);
        }
    }

    public getStatistics() {
        return this.http.get<any>(`${environment.apiUrl}/admin/statistics`);
    }

    public projectNumber() {
        return this.http.get<any>(`${environment.apiUrl}/admin/projectNumber`);
    }



    getNewSignUpsperDay() {
        return this.http.get(`${environment.apiUrl}/admin/newSignUps`, {});
    }


}
