import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "./../../environments/environment";
import { resResult } from "../_models";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getAllUser() {
    return this.http.get(`${environment.apiUrl}/users/getAllUser`, {});
  }

  getUserIDByEmail(email: string) { }

  loggedInID: string;
  loggedInEmail: string;

  getLoggedInEmail() { }

  getLoggedInID(email: string) { }

  async getUserDataByEmail(email: string) {
    const params = new HttpParams().set("email", email);
    return await this.http
      .get<any>(`${environment.apiUrl}/users/getPassWordByEmail`, {
        params: params,
      })
      .toPromise();
  }

  async getUserBasicInfo(id: string) {
    return await this.http
      .get<any>(`${environment.apiUrl}/users/getUserBasicInfo/${id}`)
      .toPromise();
  }

  async getUserInfo(uid: string) {
    return await this.http
      .get<any>(`${environment.apiUrl}/users/getUserInfo/${uid}`)
      .toPromise();
  }

  async getPassWordByEmail(email: string) {
    const params = new HttpParams().set("email", email);
    return await this.http
      .get<any>(`${environment.apiUrl}/authenticate/getPassWordByEmail`, {
        params: params,
      })
      .toPromise();
  }

  async getUserInfoByAddress(walletaddress: string) {
    return await this.http
      .get<any>(`${environment.apiUrl}/users/getUserInfoByAddress/${walletaddress}`)
      .toPromise();
  }


  public getUserOwnArtworksByAddress(walletaddress: string) {
    return this.http.get<any>(`${environment.apiUrl}/users/getUserOwnArtworksByAddress/${walletaddress}`);
  }

  public getUserOwnArtworks(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/users/getUserOwnArtworks/${id}`);
  }
  //test
  public getUserOwnArtworksByUid(uid: string) {
    return this.http.get<any>(`${environment.apiUrl}/users/getUserOwnArtworksByUid/${uid}`);
  }

  updateUserInfoEmail(email: string, uid: string) {
    return this.http.post(`${environment.apiUrl}/users/changeInformEmail`,
      {
        'email': email,
        'uid': uid
      });
  }

  updateUserEmail(email: string, uid: string) {
    return this.http.post(`${environment.apiUrl}/users/changeEmail`,
      {
        'email': email,
        'uid': uid
      });
  }

  changeWalletAddress(address: string, uid: string) {
    return this.http.post(`${environment.apiUrl}/users/changeWalletAddress`,
      {
        'walletAddress': address,
        'uid': uid
      });
  }

  changePassword(oldPassword: string, newPassword: string, uid: string) {
    return this.http.post(`${environment.apiUrl}/users/changePassword`,
      {
        oldPassword,
        newPassword,
        uid
      });
  }


  setPassword(password: string, uid: string) {
    return this.http.post(`${environment.apiUrl}/authenticate/setPassword`,
      {
        password,
        uid
      });
  }


  updateUserName(name: string, uid: string) {
    return this.http.post(`${environment.apiUrl}/users/updateUserName`,
      {
        name,
        uid
      });
  }


  confirmVerifiedEmail(uid, status) {
    return this.http.post(`${environment.apiUrl}/users/setVerified`,
      {
        uid: uid,
        status: status
      });
  }

  async getUserEmailByUid(uid: string) {
    const params = new HttpParams().set("uid", uid);
    return await this.http
      .get<any>(`${environment.apiUrl}/users/getUserEmailByUid`, {
        params: params,
      })
      .toPromise();
  }

  public updateUserBasicInfo(data) {
    return this.http
      .post<resResult>(`${environment.apiUrl}/users/updateUserBasicInfo`,
        data
      );
  }

  setFirstTime(uid: string, isFirstTime) {
    if (uid !== null || uid !== undefined) {
      return this.http.post(`${environment.apiUrl}/users/setFirstTime`,
        {
          uid: uid,
          isFirstTime
        });
    }
  }

  deleteUser(id: string) {
    return this.http.post(`${environment.apiUrl}/users/deleteUser/${id}`, {});
  }

}
