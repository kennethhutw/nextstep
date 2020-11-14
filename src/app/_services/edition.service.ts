import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class EditionService {
  constructor(private http: HttpClient) {}

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

  uploadEdition(file: File) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(
      `${environment.assetAPIUrl}/fileUpload/uploadEdition`,
      formData
    );
  }

  getPopularEditions() {}

  getRecentEditions() {}
}
