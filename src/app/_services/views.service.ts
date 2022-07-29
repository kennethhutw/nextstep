import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class ViewsService {
    constructor(private http: HttpClient) { }
    async getIPAddress() {
        return await this.http.get("https://api.ipify.org/?format=json").toPromise();
    }


    async insert(viewedId,
        type,
        viewerId,
        ipaddress,
        uid) {

        return await this.http.post(`${environment.apiUrl}/view`, {
            viewedId,
            type,
            viewerId,
            ipaddress,
            uid
        }).toPromise();
    }
}
