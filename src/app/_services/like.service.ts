import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class LikeService {
  constructor(private http: HttpClient) { }

  getUserFollow(uid) {
    return this.http.get(`${environment.apiUrl}/likes/getUserFollow/${uid}`);
  }
  async getCollection(uid) {
    return await this.http.get(`${environment.apiUrl}/likes/collection/${uid}`).toPromise();
  }

  removeLike(uid, liked_id, type) {
    return this.http.post(`${environment.apiUrl}/likes/dislike`,
      {
        liked_id,
        uid,
        type
      });
  }

  like(uid, liked_id, type) {
    return this.http.post(`${environment.apiUrl}/likes/like`,
      {
        liked_id,
        uid,
        type
      });
  }

  IsLike(uid, liked_id) {
    return this.http.get(`${environment.apiUrl}/likes/islike/${liked_id}/${uid}`);
  }
}
