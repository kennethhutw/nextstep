import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { resResult } from "../_models";

@Injectable()
export class ArtWorkService {
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

  public createArtwrok(formdata) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/artwork/createArtwrok`,
        formdata
      );
  }

  public getArtwrokByArtistId(artistId) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getArtwrokByArtistId/${artistId}`);
  }

  public getSoldArtwrokByArtistId(artistId) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getSoldArtwrokByArtistId/${artistId}`);
  }


  public getArtwrokById(id) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getArtwrokById/${id}`);
  }

  public getLatestArtWork() {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getLatestArtWork`);
  }

  public getPopularArtwork() {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getPopularArtwork`);
  }

  public getSellArtwork() {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getSellArtwork`);
  }

  public getSellCollectorArtwork(uid) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getSellCollectorArtwork/${uid}`);
  }

  public getArtworkByCollector(uid) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getArtworkByCollector/${uid}`);
  }

  public getArtwrokByEditionId(editionId) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/getArtwrokByEditionId/${editionId}`);
  }

  public purchase(uid,
    owner,
    usdValue,
    ethValue,
    artistId,
    buyerId,
    walletAddress,
    editionId,
    artworkId,
    transactionHash,
    from,
    to,
    tokenId,
    network) {
    return this.http.post(`${environment.apiUrl}/artwork/purchase`,
      {
        uid,
        owner,
        usdValue,
        ethValue,
        artistId,
        buyerId,
        walletAddress,
        editionId,
        artworkId,
        transactionHash,
        from,
        to,
        tokenId,
        network
      });
  }
}
