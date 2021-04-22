import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";

@Injectable()
export class PendingEditionService {
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
            alert(errorMessage);
            return throwError(errorMessage);
        }
    }


    public updatePendingEdition(artistId, uid, approve) {
        return this.http.post(`${environment.apiUrl}/pendingedition/updatePendingEdition`,
            {
                artistId,
                uid,
                approve
            })
    }

    public getPendingEdition(uid) {
        return this.http.get<any>(`${environment.apiUrl}/pendingedition/getPendingEdition/${uid}`);

    }


}