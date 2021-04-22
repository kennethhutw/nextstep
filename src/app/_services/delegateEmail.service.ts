import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DelegateEmailService {

    constructor(
        private http: HttpClient
    ) {
    }

    getAll() {
        return this.http.get(`${environment.apiUrl}/delegatingEmail/getAll`,
            {

            });
    }

    deleteDelegatingEmail(id) {
        return this.http.post(`${environment.apiUrl}/delegatingEmail/deleteDelegatingEmail`,
            {
                id: id
            });
    }

    createDelegatingEmail(email, delegatingEmail, uid) {
        return this.http.post(`${environment.apiUrl}/delegatingEmail/createDelegatingEmail`,
            {
                email: email,
                delegatingEmail: delegatingEmail,
                uid: uid
            });
    }

}
