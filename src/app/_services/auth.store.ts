import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EmailService, UserService } from '../_services';


import { environment } from "./../../environments/environment";
import { UserInterface } from "../_models/user.model";
import { resResult } from "./../_models";
import { map, shareReplay, tap } from "rxjs/operators";


import { HttpClient } from "@angular/common/http";
import { Utility } from "../_helpers";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
const AUTH_DATA = "auth_data";
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<UserInterface>(null);
  private web3Subject = new BehaviorSubject<any>(null);

  user$: Observable<UserInterface> = this.subject.asObservable();

  web3$: Observable<any> = this.web3Subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isWeb3In$: Observable<boolean>;
  isWeb3Out$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private utility: Utility,
    private emailService: EmailService,
    private userSrv: UserService) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((LoggedIn) => !LoggedIn));

    const user = localStorage.getItem(AUTH_DATA);

    if (!this.utility.IsNullOrEmpty(user) && this.utility.isJSONString(user)) {
      this.subject.next(JSON.parse(user));
    } else {
      this.logout();
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
          const _user = resResult.data as UserInterface;

          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
          this.subject.next(_user);
        }),
        shareReplay()
      );
  }

  walletSignin(walletAddress: string, role: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/authenticate/walletLogin`, {
        address: walletAddress,
        role: role,
      })

      .pipe(
        tap((resResult) => {
          if (resResult["result"] === "successful") {
            const _user = resResult.data as UserInterface;
            this.subject.next(_user);
            localStorage.setItem("access_token", resResult.token);
            if (!this.utility.IsNullOrEmpty(_user)) {
              localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
            }
          }
        }),
        shareReplay(),
        catchError(errorRes => {
          let errorMsg = 'An unknow error occurred!';
          if (!errorRes.error || !errorRes.error.error
          ) {
            return throwError(errorMsg);
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMsg = 'This wallet exists already';
          }
          return throwError(errorMsg);
        })
      );
  }

  ArtistSignup(artist): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/artistSignup`,
        artist
      )
      .pipe(
        tap((resResult) => {
          console.log("ArtistSignup resResult :", resResult);
          // const _user = resResult.data as UserInterface;
          // this.subject.next(_user);
          // localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
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
          const _user = resResult.data as UserInterface;
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
          const _user = resResult.data as UserInterface;
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
          this.subject.next(_user);
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

  getUserData() {
    try {
      if (!this.utility.IsNullOrEmpty(localStorage.getItem(AUTH_DATA))) {
        if (this.utility.isJSONString(localStorage.getItem(AUTH_DATA))) {
          return JSON.parse(localStorage.getItem(AUTH_DATA));
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(`getUserData failed : ${error}`);
      return null;
    }
  }

  setUserData(userData) {
    try {
      localStorage.setItem(AUTH_DATA, JSON.stringify(userData));
      this.subject.next(userData);
      return true;
    } catch (error) {
      console.error(`setUserData failed : ${error}`);
      return false;
    }
  }
  sendAuthEmail(uid, email, role = '') {
    const domain = window.location.origin;
    const url = '/verifyEmail';
    const currentTime = new Date();
    const timeInMs = currentTime.getTime();
    const link = domain + url + '?uid=' + uid + '&time=' + timeInMs + '&role=' + role;

    return this.emailService.authenticateEmail(
      'Welcome to the Formoas Art platform!',
      email,
      link,
      uid);
  }

  reloadCurrentUserInfo() {
    let currentUser = this.getUserData();
    this.userSrv.getUserBasicInfo(currentUser.id).then(res => {
      if (res['result'] == 'successful') {
        const _user = res.data as UserInterface;
        this.subject.next(_user);
        localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
      }
    }).catch(error => {
      console.error("reloadCurrentUserInfo failed : ", error);
    })
  }

}
