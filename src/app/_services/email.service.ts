import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmailService {

    constructor(private http: HttpClient) {
    }

    authenticateEmail(title, receiver, link, uid) {
        return this.http.post(`${environment.apiUrl}/authenticateMail`,
            {
                'subject': title,
                'receiver': receiver,
                'link': link,
                'uid': uid
            });
    }

    sendResetPasswordEmail(subject, receiverEmail, link) {
        return this.http.post(`${environment.apiUrl}/resetPassoword`,
            {
                'subject': subject,
                'receiverEmail': receiverEmail,
                'link': link
            });
    }


    sendResetPasswordEmailByUid(subject, uid, link) {
        return this.http.post(`${environment.apiUrl}/resetPassowordByUid`,
            {
                'subject': subject,
                'uid': uid,
                'link': link
            });
    }

    sendEmail(title, receiver, link, uid, requester, requesterOrg) {
        return this.http.post(`${environment.apiUrl}/sendMail`,
            {
                'subject': title,
                'receiver': receiver,
                'link': link,
                'uid': uid,
                'requester': requester,
                'requesterOrg': requesterOrg
            });
    }

    sendWelcomeEmail(name, receiver) {
        return this.http.post(`${environment.apiUrl}/sendWelcomeEmail`,
            {
                'name': name,
                'receiver': receiver
            });
    }


}
