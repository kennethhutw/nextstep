import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "./../../environments/environment";
import { User } from "./../_models/user";
import { resResult } from "./../_models";
import { map, shareReplay, tap } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
const AUTH_DATA = "auth_data";
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((LoggedIn) => !LoggedIn));

    const user = localStorage.getItem(AUTH_DATA);

    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  walletsignup(walletAddress: string, role: string): Observable<resResult> {
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

  walletsignin(walletAddress: string): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/walletLogin`, {
        address: walletAddress,
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
}
