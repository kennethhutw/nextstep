import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "./../../environments/environment";
import { User } from "./../_models/user";
import { resResult,NewArtist } from "./../_models";
import { map, shareReplay, tap } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Utility } from "../_helpers";
const AUTH_DATA = "auth_data";
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient, private utility: Utility) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((LoggedIn) => !LoggedIn));

    const user = localStorage.getItem(AUTH_DATA);

    if (!this.utility.IsNullOrEmpty(user)) {
      this.subject.next(JSON.parse(user));
    }
  }

  walletSignup(walletAddress: string, role: string): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/walletSignUp`, {
        address: walletAddress,
        role: role,
      })
      .pipe(
        tap((resResult) => {
          const _user = resResult.data as User;
          this.subject.next(_user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
        }),
        shareReplay()
      );
  }

  walletSignin(walletAddress: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/authenticate/walletLogin`, {
        address: walletAddress,
      })
      .pipe(
        tap((resResult) => {
          if (resResult["result"] === "successful") {
            const _user = resResult.data as User;
            this.subject.next(_user);
            localStorage.setItem("access_token", resResult.token);
            if (!this.utility.IsNullOrEmpty(_user)) {
              localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
            }
          }
        }),
        shareReplay()
      );
  }

  ArtistSignup(artist): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/artistSignup`,
        artist
      )
      .pipe(
        tap((resResult) => {
          console.log("ArtistSignup resResult :",resResult);
          const _user = resResult.data as User;
          this.subject.next(_user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
        }),
        shareReplay()
      );
  }

  signup(email: string, password: string, role: string): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/emailSignUp`, {
        email,
        password,
        role,
      })
      .pipe(
        tap((resResult) => {
          const _user = resResult.data as User;
          this.subject.next(_user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
        }),
        shareReplay()
      );
  }

  login(email: string, password: string): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/emailLogin`, {
        email,
        password,
      })
      .pipe(
        tap((resResult) => {
          const _user = resResult.data as User;
          this.subject.next(_user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
        }),
        shareReplay()
      );

    //  this.userSrv
    //    .getPassWordByEmail(this.signinEmailForm.value.email)
    //    .then((res) => {
    //      if (res["result"] === "successful") {
    //        const verified = bcrypt.compareSync(
    //          _password,
    //          res["data"]["password"]
    //        );
    //        if (verified) {
    //          localStorage.setItem(
    //            "currentUser",
    //            JSON.stringify(res.data)
    //          );
    //          this.currentUser = res.data;
    //        }
    //      }
    //    });
  }

  logout() {
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }

  getUserData(){
     // localStorage.getItem(AUTH_DATA);
     try {
      if (this.utility.isJSONString(localStorage.getItem(AUTH_DATA))) {
        return JSON.parse(localStorage.getItem(AUTH_DATA));
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
