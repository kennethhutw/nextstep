import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { EmailService, UserService } from '../_services';
import { environment } from "./../../environments/environment";
import { UserInterface } from "../_models/user.model";
import { resResult } from "./../_models";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Utility } from "../_helpers";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";


const AUTH_DATA = "auth_data";
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<UserInterface>(null);

  user$: Observable<UserInterface> = this.subject.asObservable();

  /*
  0:logout
  1:login
  2:forcedlogout
  */

  private _logoutState = new BehaviorSubject(0);
  logoutState = this._logoutState.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private utilitySrv: Utility,
    private emailService: EmailService,
    private userSrv: UserService,
    private socialAuthService: SocialAuthService) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((LoggedIn) => !LoggedIn));

    const user = localStorage.getItem(AUTH_DATA);

    if (!this.utilitySrv.IsNullOrEmpty(user) &&
      this.utilitySrv.isJSONString(user)) {
      this.subject.next(JSON.parse(user));
    } else {
      this.logout();
    }
  }


  signup(name: string, email: string, password: string): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/emailSignUp`, {
        name,
        email,
        password
      })
      .pipe(
        tap((resResult) => {
          const _user = resResult.data as UserInterface;
          this.subject.next(_user);
          localStorage.setItem("access_token", resResult["token"]);
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
        }),
        shareReplay()
      );
  }

  invitedSignup(invitationId,
    projectId,
    name: string,
    email: string, password: string): Observable<resResult> {
    return this.http
      .post<resResult>(`${environment.apiUrl}/authenticate/emailInvitedSignUp`, {
        invitationId,
        projectId,
        name,
        email,
        password
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

  socialInvitedSignup(invitationId,
    projectId,
    id: string,
    name: string,
    email: string,
    token: string,
    provider: string) {
    return this.http
      .post(`${environment.apiUrl}/authenticate/socialInvitedSignup`, {
        invitationId,
        projectId,
        id,
        name,
        email,
        token,
        provider
      })
      .pipe(
        tap((resResult) => {
          const _user = resResult['data'];
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

          localStorage.setItem("access_token", resResult["token"]);
          localStorage.setItem(AUTH_DATA, JSON.stringify(_user));
          this.subject.next(_user);
          this._logoutState.next(1);
        }),
        shareReplay()
      );
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    return this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + " sign in data : ", userData);
        // Now sign-in with userData
        // ...

      }
    );
  }


  socialLogin(id: string, name: string,
    email: string, token: string,
    provider: string) {
    return this.http
      .post(`${environment.apiUrl}/authenticate/socialLogin`, {
        'id': id,
        'name': name,
        'email': email,
        'token': token,
        'provider': provider
      });
  }

  socialSignUp(id: string, name: string,
    email: string, token: string,
    provider: string) {
    return this.http
      .post(`${environment.apiUrl}/authenticate/socialSignUp`, {
        'id': id,
        'name': name,
        'email': email,
        'token': token,
        'provider': provider
      });
  }

  forecdLogout() {
    this._logoutState.next(2);
  }


  logout() {
    this.subject.next(null);
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((LoggedIn) => !LoggedIn));
    localStorage.removeItem(AUTH_DATA);
    this._logoutState.next(0);
  }

  getUserData() {
    try {
      if (!this.utilitySrv.IsNullOrEmpty(localStorage.getItem(AUTH_DATA))) {
        if (this.utilitySrv.isJSONString(localStorage.getItem(AUTH_DATA))) {
          return JSON.parse(localStorage.getItem(AUTH_DATA));
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(`getUserData failed :`, error);
      return null;
    }
  }

  setUserData(userData) {
    try {
      localStorage.setItem(AUTH_DATA, JSON.stringify(userData));
      this.subject.next(userData);
      return true;
    } catch (error) {
      console.error(`setUserData failed : `, error);
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
      'Welcome to the NextStep platform!',
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

  public getEmail(email) {
    return this.http.get<any>(`${environment.apiUrl}/authenticate/emailLogin/${email}`);
  }

  async checkUserData(email, walletAddress) {
    const params = new HttpParams().set('email', email).set('walletAddress', walletAddress);
    return await this.http.get<any>(`${environment.apiUrl}/authenticate/checkUserData`, { params: params }).toPromise();
  }

  async getCheckData() {
    return await this.http.get<any>(`${environment.apiUrl}/authenticate/checkdata`, {}).toPromise();
  }

  async checkUserEmail(email) {

    return await this.http.get<any>(`${environment.apiUrl}/authenticate/checkUserData/${email}`, {}).toPromise();
  }


  verifyToken(token) {
    return this.http.post(`${environment.apiUrl}/authenticate/verifyToken`,
      {
        token: token
      });
  }

  async IsExistEmail(email) {
    return await this.http.get<any>(`${environment.apiUrl}/authenticate/email/${email}`).toPromise();
  }

}
