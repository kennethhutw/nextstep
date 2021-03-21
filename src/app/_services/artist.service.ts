import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";
@Injectable()
export class ArtistService {
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

  public getArtistBasicInfo(id) {
    return this.http.get<any>(`${environment.apiUrl}/artists/getArtistBasicInfo/${id}`);
  }

  public getArtistBasicInfoByEmail(email) {
    return this.http.get<any>(`${environment.apiUrl}/artists/getArtistBasicInfoByEmail/${email}`);
  }

  public getArtistBasicInfoByUid(uid) {
    return this.http.get<any>(`${environment.apiUrl}/artists/getArtistBasicInfoByUid/${uid}`);
  }

  public getArtistArtwork(uid) {
    return this.http.get<any>(`${environment.apiUrl}/artists/getArtistArtwork/${uid}`);
  }

  public updateArtistBasicInfo(data) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/artists/updateArtistBasicInfo`,
        data
      );
  }

  public getArtists() {
    return this.http.get<any>(`${environment.apiUrl}/artists/getArtists`);
  }

}
