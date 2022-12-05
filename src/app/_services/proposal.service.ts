import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable()
export class ProposalService {
  constructor(private http: HttpClient) { }

  insert(title, detail, category, uid) {
    return this.http.post(`${environment.apiUrl}/proposal/insert`,
      {
        title,
        detail,
        category,
        uid
      });
  }

  async delete(id, uid) {
    return await this.http.delete(`${environment.apiUrl}/proposal/${id}/${uid}`,
      {
      }).toPromise();;
  }

  update(id, title, detail, category, uid) {
    return this.http.put(`${environment.apiUrl}/proposal/${id}`,
      {
        title,
        detail,
        category,
        uid
      });
  }

  getall() {
    return this.http.get(`${environment.apiUrl}/proposal/getall`);
  }

  getProposal(uid: string) {
    return this.http.get(`${environment.apiUrl}/proposal/${uid}`);
  }

  getProposalByStatus(status) {
    const params = new HttpParams()
      .set('status', status);
    return this.http.get(`${environment.apiUrl}/proposal/getProposalByStatus`,
      { params: params }).toPromise();
  }



}
