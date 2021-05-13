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

    sendApplicationEmail(subject, receiverName, receiverEmail, link, uid) {
        return this.http.post(`${environment.apiUrl}/email/sendapplicationEmail`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'link': link,
                'uid': uid
            });
    }

    sendapprovedEmail(artistId, subject, receiverName, receiverEmail, link, uid) {
        return this.http.post(`${environment.apiUrl}/email/sendapprovedEmail`,
            {
                'artistId': artistId,
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'link': link,
                'uid': uid
            });
    }

    sendrejectedEmail(subject, receiverName, receiverEmail, link, uid) {
        return this.http.post(`${environment.apiUrl}/email/snedrejectedEmail`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'link': link,
                'uid': uid
            });
    }

    sendAvailableEmail(subject, receiverName, receiverEmail, link, artworkName, uid) {
        return this.http.post(`${environment.apiUrl}/email/availableEmail`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'artworkName': artworkName,
                'link': link,
                'uid': uid
            });
    }


    sendReceivedArtworkEmail(subject, receiverName, receiverEmail, link, artworkName, uid) {
        return this.http.post(`${environment.apiUrl}/email/receivedArtworkEmail`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'artworkName': artworkName,
                'link': link,
                'uid': uid
            });
    }

    sendSoldEmail(subject, receiverName, receiverEmail, link, artworkName, uid) {
        return this.http.post(`${environment.apiUrl}/email/soldEmail`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'artworkName': artworkName,
                'link': link,
                'uid': uid
            });
    }

    sendPurchaseEmail(subject, receiverName, receiverEmail, link, artworkName, uid) {
        return this.http.post(`${environment.apiUrl}/email/purchaseEmail`,
            {
                'subject': subject,
                'receiverName': receiverName,
                'receiverEmail': receiverEmail,
                'artworkName': artworkName,
                'link': link,
                'uid': uid
            });
    }

}
