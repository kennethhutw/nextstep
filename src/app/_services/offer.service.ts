import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class OfferService {
    constructor(private http: HttpClient) { }

    getBidArtWork(bidderId) {
        return this.http.get(`${environment.apiUrl}/offer/getBidArtWork/${bidderId}`);
    }

}
