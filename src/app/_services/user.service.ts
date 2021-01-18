import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "./../../environments/environment";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUser() {
    return null;
  }

  getUserIDByEmail(email: string) {}

  loggedInID: string;
  loggedInEmail: string;

  getLoggedInEmail() {}

  getLoggedInID(email: string) {}


  async getPassWordByEmail(email: string) {
    const params = new HttpParams().set("email", email);
    return await this.http
      .get<any>(`${environment.apiUrl}/authenticate/getPassWordByEmail`, {
        params: params,
      })
      .toPromise();
  }


  updateUserInfoEmail(email:string, uid :string){
      return this.http.post(`${environment.apiUrl}/users/changeInformEmail`,
            {
                'email': email,
                'uid': uid
            });
  }

  changeWalletAddress(address:string, uid :string){
      return this.http.post(`${environment.apiUrl}/users/changeWalletAddress`,
      {
          'walletAddress': address,
          'uid': uid
      });
  }

  changePassword(oldPassword:string, newPassword:string, uid :string){
      return this.http.post(`${environment.apiUrl}/users/changePassword`,
      {
          oldPassword,
          newPassword,
          uid
      });
  }



}
