import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";

@Injectable()
export class GalleryService {
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



    getPopularEditions() { }

    getRecentEditions() { }

    public createArtwrok(formdata) {
        return this.http
            .post<resResult>(`${environment.apiUrl}/artwork/createArtwrok`,
                formdata
            );
    }

    public generateArtwrok(formdata) {
        return this.http
            .post<any>(`${environment.apiUrl}/artwork/generateArtwrok`,
                formdata
            );
    }

    public getEditionDetailByEditionId(editionId) {
        return this.http.get<any>(`${environment.apiUrl}/gallery/getEditionDetailByEditionId/${editionId}`);
    }

    // public getSoldArtwrokByArtistId(artistId) {
    //     return this.http.get<any>(`${environment.apiUrl}/artwork/getSoldArtwrokByArtistId/${artistId}`);
    // }


    // public getArtwrokById(id) {
    //     return this.http.get<any>(`${environment.apiUrl}/artwork/getArtwrokById/${id}`);
    // }
}
