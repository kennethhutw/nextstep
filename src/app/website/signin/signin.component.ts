import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild
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
/* import { environment } from "../../../environments/environment";*/
import {
  AuthService,
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angular-6-social-login";
declare var google: any;

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
export class SigninComponent implements OnInit, AfterViewInit {

  @ViewChild('buttonDiv') socialbutton;
  width = false;
  loginForm: FormGroup;
  submitted = false;

  invalidUser = false;
  unverifiedUser = false;
  GooglePlusNotExist = false;
  redirectURL: string = "";

  client = null;

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
    private dataSrv: DataService,
    private utilitySrv: Utility
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);

    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);

      }
    });

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

  ngAfterViewInit(): void {
    this.client = google.accounts.id.initialize({
      client_id: "1093364473991-70t3haupsjd78sekbn2lkjrqlb5oo6c8.apps.googleusercontent.com",
      ux_mode: "popup",
      callback: (response: any) => this.handleGoogleSignIn(response)
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      {
        theme: 'outline',

        text: "透過 Google 登入"
      }  // customization attributes
    );

  }

  socialSignIn2() {
    let btn = <HTMLElement>document.querySelector("div[role=button]");
    if (btn instanceof HTMLElement) {
      (<HTMLElement>document.querySelector("div[role=button]")).click();
    }

  }

  handleGoogleSignIn(response: any) {


    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    var userData = JSON.parse(jsonPayload);

    this.authSrv.socialLogin(userData.id,
      userData.name,
      userData.email,
      userData.idToken,
      'google').subscribe(result => {

        if (result['result'] === 'successful') {
          const user = result['data'];
          if (user !== undefined) {
            if (user.firstTime !== 1) {
              localStorage.setItem("access_token", result["token"]);
              localStorage.setItem("auth_data", JSON.stringify(user));
              this.router.navigate(["./dashboard"], {});
            } else if (user.firstTime === 1) {
              localStorage.setItem('token', result['token']);
              localStorage.setItem('auth_data', JSON.stringify(user));
              this.router.navigate(["./info"], {});
            }
          }
        } else if (result['result'] === 'failed') {
          // this.confirmDialogService.infoThis(`This email address is already being used, please login manually.`, () => { });
        } else if (result['result'] === 'new') {
          this.authSrv.socialSignUp(userData.id, userData.name,
            userData.email, userData.idToken,
            'google').subscribe(value => {

              if (value['result'] === 'successful') {
                const user = value['data'];
                if (user.firstTime !== 1) {
                  localStorage.setItem("access_token", value["token"]);
                  localStorage.setItem("auth_data", JSON.stringify(user));
                  this.router.navigate(["./dashboard"], {});
                } else if (user.firstTime === 1) {
                  localStorage.setItem('token', value['token']);
                  localStorage.setItem('auth_data', JSON.stringify(user));
                  this.router.navigate(["./info"], {});
                }
              }
            });
        } else if (result['error']) {
          console.log(result['error']);
        }
      }, error => console.error('Error :', error));

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
    } else if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {

        this.authSrv.socialLogin(userData.id,
          userData.name,
          userData.email,
          userData.idToken,
          socialPlatform).subscribe(result => {

            if (result['result'] === 'successful') {
              const user = result['data'];
              if (user !== undefined) {
                if (user.firstTime !== 1) {
                  localStorage.setItem("access_token", result["token"]);
                  localStorage.setItem("auth_data", JSON.stringify(user));
                  this.router.navigate(["./dashboard"], {});
                } else if (user.firstTime === 1) {
                  localStorage.setItem('token', result['token']);
                  localStorage.setItem('auth_data', JSON.stringify(user));
                  this.router.navigate(["./info"], {});
                }
              }

            } else if (result['result'] === 'failed') {
              // this.confirmDialogService.infoThis(`This email address is already being used, please login manually.`, () => { });
            } else if (result['result'] === 'new') {
              this.authSrv.socialSignUp(userData.id, userData.name,
                userData.email, userData.idToken,
                socialPlatform).subscribe(value => {

                  if (value['result'] === 'successful') {
                    const user = value['data'];
                    if (user.firstTime !== 1) {
                      localStorage.setItem("access_token", value["token"]);
                      localStorage.setItem("auth_data", JSON.stringify(user));
                      this.router.navigate(["./dashboard"], {});
                    } else if (user.firstTime === 1) {
                      localStorage.setItem('token', value['token']);
                      localStorage.setItem('auth_data', JSON.stringify(user));
                      this.router.navigate(["./info"], {});
                    }
                  }
                });
            } else if (result['error']) {
              console.log(result['error']);
            }
          }, error => console.error('Error :', error));

      }
    ).catch(error => {
      console.error('socialSignIn Error:', error);
    });



  }
}
