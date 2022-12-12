import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthStore } from "./../_services/auth.store";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthStore,
    private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!!localStorage.getItem("access_token")) {
      return this.auth.verifyToken(localStorage.getItem('access_token')).pipe(map(res => {

        if (res['data']) {
          return true;
        } else {
          this.auth.logout();
          this.router.navigate(['/']);
          return false;
        }
      }));
    }
    else {
      this.auth.logout();
      this.router.navigate(['/']);
      return false;
    }
  }

  //CanActivateChild
  //canActivateChild(): Observable<boolean | UrlTree> {}

  //   canActivateChild(
  //     childRoute: ActivatedRouteSnapshot,
  //     state: RouterStateSnapshot
  //   ): Observable<boolean | UrlTree> {
  //     return this.checkIfAuthenticated();
  //   }

  private checkIfAuthenticated() {
    return this.auth.isLoggedIn$.pipe(
      map((loggedIn) => (loggedIn ? true : this.router.parseUrl("/login")))
    );
  }
}
