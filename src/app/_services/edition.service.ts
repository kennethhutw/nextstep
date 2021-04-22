import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";

@Injectable()
export class EditionService {
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

  uploadEdition(file: File) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(
      `${environment.assetAPIUrl}/fileUpload/uploadEdition`,
      formData
    );
  }

  getPopularEditions() { }

  getRecentEditions() { }

  public createEdition(formdata) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/edition/createEdition`,
        formdata
      );
  }

  public getEditionByArtistId(artistId) {
    return this.http.get<any>(`${environment.apiUrl}/edition/getEditionByArtistId/${artistId}`);
  }


  public getEditionById(id) {
    return this.http.get<any>(`${environment.apiUrl}/edition/getEditionById/${id}`);
  }

  public getEditions() {
    return this.http.get<any>(`${environment.apiUrl}/edition/editions`);
  }
  public getTokenizeEdition(id) {
    return this.http.get<any>(`${environment.apiUrl}/edition/tokenizeEdition/${id}`);
  }

  public getTokenUriById(id) {
    return this.http.get<any>(`${environment.apiUrl}/edition/tokenUriById/${id}`);
  }

  public createIPFSLink(editionId, tokenId, name, description, artist, tags, asset_type, external_uri, imageUri) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/ipfs/createIPFSLink`,
        {
          editionId, tokenId, name, description, artist, tags, asset_type, external_uri, imageUri
        }
      );
  }

  public highestNumber() {
    return this.http.get<any>(`${environment.apiUrl}/edition/highestNumber`);
  }

  updateHighestEditionNumber(number, id, uid) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/edition/updateHighestEditionNumber`,
        {
          number, id, uid
        }
      );
  }

  generateArtwork(artistId,
    editionId,
    name,
    description,
    tags,
    isBid,
    usdprice,
    image_type,
    imageName,
    imageUrl,
    totalamount,
    firstnumber,
    uid) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/artwork/generateArtwrok`,
        {
          artistId,
          editionId,
          name,
          description,
          tags,
          isBid,
          usdprice,
          image_type,
          imageName,
          imageUrl,
          totalamount,
          firstnumber,
          uid
        }
      );
  }

  updateStatusByEditionId(status, uid, editionId) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/edition/updateStatusByEditionId`,
        {
          status, uid, editionId
        }
      );
  }
}
