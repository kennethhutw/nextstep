import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { environment } from "../../../environments/environment";
import { AuthService, GoogleLoginProvider } from "angular-6-social-login";
import {
  Router,
  ActivatedRoute
} from "@angular/router";
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: [
    "./signin.component.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {
  width = false;
  loginForm: FormGroup;
  submitted = false;

  invalidUser = false;
  unverifiedUser = false;
  GooglePlusNotExist = false;
  redirectURL: string = "";

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    let screenHeight = window.innerHeight;
    let screenWidth = window.innerWidth;
    if (screenWidth > 991) {
      this.width = true;
    } else {
      this.width = false;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authSrv: AuthStore,
    private socialAuthService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private translateSrv: TranslateService,
    private utility: Utility
  ) {


  }

  ngOnInit() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(emailRegex)]],
      password: ["", Validators.required],
    });
    let params = this.route.snapshot.queryParams;
    if (params['redirectURL']) {
      this.redirectURL = params['redirectURL'];
    }
  }

  inValid() {
    return this.loginForm.invalid;
  }

  onSubmit() {
    this.submitted = true;
    const values = this.loginForm.value;

    this.authSrv.login(values.email, values.password).subscribe(
      (res) => {
        if (res["result"] === "successful") {
          if (this.redirectURL) {
            this.router.navigateByUrl(this.redirectURL,)
              .catch(() => this.router.navigate(["./dashboard"]))
          } else {
            this.router.navigate(["./dashboard"], {});
          }
        } else {
          this.invalidUser = true;
        }
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        console.log(" Sign in failed! ", err);
        this.invalidUser = true;
        this.changeDetectorRef.detectChanges();
      }
    );


  }

  socialSignIn(socialPlatform: string) {

    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log("===============", userData);
        this.authSrv.googleLogin(userData.id,
          userData.name,
          userData.email,
          userData.token).subscribe(result => {

            if (result['result'] === 'successful') {
              const user = result['data'];
              if (user !== undefined) {
                if (user.dob) {
                  localStorage.setItem('token', result['token']);
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  // this.router.navigate(["./profile/" + res['data'].id], {});
                } else {
                  localStorage.setItem('token', result['token']);
                  localStorage.setItem('currentUser', JSON.stringify(user));

                }
              }
            } else if (result['result'] === 'failed') {
              // this.confirmDialogService.infoThis(`This email address is already being used, please login manually.`, () => { });
            } else if (result['result'] === 'new') {
              this.authSrv.googleSignUp(userData.id, userData.name, userData.email, userData.token).subscribe(value => {

                if (value['result'] === 'successful') {
                  const user = value['data'];
                  if (user.firstTime !== 1) {
                    localStorage.setItem('token', value['token']);
                    localStorage.setItem('currentUser', JSON.stringify(user));

                  } else if (user.firstTime === 1) {
                    localStorage.setItem('token', value['token']);
                    localStorage.setItem('currentUser', JSON.stringify(user));

                  }
                }
              });
            } else if (result['error']) {
              console.log(result['error']);
            }
          }, error => console.error('Error :', error));
      }
    ).catch(error => {
      console.error('Error 111111:', error);
    });



  }
}
