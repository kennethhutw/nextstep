import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthStore } from "./../_services/auth.store";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthStore,
     private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem("access_token")) {
      return true;
    }

    this.router.navigate(["login"]);
    return false;
    //return this.auth.isLoggedIn$.pipe(map(loggedIn=> loggedIn? true:  this.router.parseUrl('/home')));
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
