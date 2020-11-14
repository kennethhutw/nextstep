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

  walletLogin(address: string) {
    try {
      return this.http.post(`${environment.apiUrl}/authenticate/walletLogin`, {
        ethaddress: address,
      });
    } catch (error) {
      console.error("login", error);
    }
  }

  async getPassWordByEmail(email: string) {
      const params = new HttpParams().set("email", email);
    return await this.http
      .get<any>(`${environment.apiUrl}/authenticate/getPassWordByEmail`, {
        params: params,
      })
      .toPromise();;
  }

  login(email: string, password: string) {
    try {
      return this.http.post(`${environment.apiUrl}/authenticate/emailLogin`, {
        email: email,
        password: password,
      });
    } catch (error) {
      console.error("login", error);
    }
  }

  signup(email: string, password: string, name: string, ethaddress: string) {
    try {
      return this.http.post(`${environment.apiUrl}/user/signup`, {
        email: email,
        password: password,
        name: name,
        ethaddress: ethaddress,
      });
    } catch (error) {
      console.error("signup", error);
    }
  }
}
