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

    sendResetPasswordEmail(subject, receiverName, receiverEmail, link, uid) {
        return this.http.post(`${environment.apiUrl}/resetPassoword`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'link': link,
                'uid': uid
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

}
