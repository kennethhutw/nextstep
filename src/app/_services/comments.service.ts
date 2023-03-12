import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable()
export class CommentsService {
  headers;
  constructor(
    private http: HttpClient
  ) {

  }

  insertComment(userId, proposalId, content) {
    return this.http.post(`${environment.apiUrl}/proposal/insertComment`,
      {
        uid: userId,
        proposalId,
        content
      });
  }

  getCommentsByProposalId(proposalId) {
    return this.http.get(`${environment.apiUrl}/proposal/getComment/${proposalId}`);
  }

  getAll() {
    // return this.apiService.get(`/articles/${slug}/comments`)
    //   .pipe(map(data => data.comments));
    return this.http.get(`${environment.apiUrl}/proposal/getall`);
  }

  destroy(commentId) {
    return this.http.post(`${environment.apiUrl}/proposal/delete/${commentId}`, {});
  }

  add(proposalId, content, uid) {
    return this.http.post(`${environment.apiUrl}/proposal/insertComment`, {
      proposalId,
      content,
      uid
    });
  }

  // for mentor


}
