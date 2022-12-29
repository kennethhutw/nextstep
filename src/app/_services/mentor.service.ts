import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


@Injectable()
export class MentorService {
    headers;
    constructor(
        private http: HttpClient
    ) {

    }

    getComments(mentorId) {
        return this.http.get(`${environment.apiUrl}/mentors/${mentorId}/comments`);
    }



    deleteComment(commentId) {
        return this.http.post(`${environment.apiUrl}/mentors/comment/${commentId}`, {});
    }

    insertComment(mentorId, content, rating, userId) {
        return this.http.post(`${environment.apiUrl}/mentors/${mentorId}/comment`, {
            rating,
            content,
            userId
        });
    }

    // for mentor


}
