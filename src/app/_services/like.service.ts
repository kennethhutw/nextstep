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

  getUserLikeArtist(user_id) {
    return this.http.get(`${environment.apiUrl}/likes/getUserLikeArtist/${user_id}`);
  }

  getUserLikeByAddress(address) {
    return this.http.get(`${environment.apiUrl}/likes/getUserLikeByAddress/${address}`);
  }
  getUserLikeArtWork(user_id) {
    return this.http.get(`${environment.apiUrl}/likes/getUserLikeArtWork/${user_id}`);
  }

  removeLike(uid, liked_id) {
    return this.http.post(`${environment.apiUrl}/likes/dislike`,
      {
        'liked_id': liked_id,
        'uid': uid
      });
  }

  like(uid, liked_id) {
    return this.http.post(`${environment.apiUrl}/likes/like`,
      {
        'liked_id': liked_id,
        'uid': uid
      });
  }

  IsLike(uid, liked_id) {
    return this.http.get(`${environment.apiUrl}/likes/islike/${liked_id}/${uid}`);
  }
}
