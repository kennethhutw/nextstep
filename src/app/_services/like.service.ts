import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class LikeService {
  constructor(private http: HttpClient) {}

    getUserFollow(uid){
        return this.http.get(`${environment.apiUrl}/likes/getUserFollow/${uid}` );
    }
}
