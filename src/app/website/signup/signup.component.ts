import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService
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

import {
  Router
} from "@angular/router";
import {
  AuthService,
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angular-6-social-login";
declare var google: any;
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: [
    "./signup.component.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit, AfterViewInit {
  width = false;
  signupForm: FormGroup;
  submitted = false;

  InvalidUser = false;
  unverifiedUser = false;
  GooglePlusNotExist = false;
  nameExistant = false;
  emailExistant = false;

  checkData = null;
  errMessage = "";

  strPassword: string = "";


  constructor(
    private socialAuthService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private authSrv: AuthStore,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private dataSrv: DataService
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
    this.signupForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(emailRegex)]],
      password: ["", Validators.required],
    });

    this.authSrv.getCheckData().then(res => {
      if (res['result'] == 'successful') {
        this.checkData = res['data'];
      }
    }).catch(error => {
      console.error("check data failed", error);
    })
  }

  intialTerms() {

    this.translateSrv.get("PASSWORD").subscribe((text: string) => {
      this.strPassword = text;
    });

  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
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
    return this.signupForm.invalid;
  }

  onSubmit() {

    const values = this.signupForm.value;
    if (this.checkData != null) {
      let _name = values.name.replace(" ", "_");
      let checkNameResult = this.checkData.find(data => data.uid == _name);
      if (checkNameResult) {
        this.nameExistant = true;
        return;
      }
      let checkEmailResult = this.checkData.find(data => data.email == values.email);
      if (checkEmailResult) {
        this.emailExistant = true;
        return;
      }

    }
    this.authSrv.signup(values.name, values.email, values.password).subscribe(res => {
      if (res['result'] == 'successful') {
        this.router.navigate(["./info"], {});
      } else {

      }
    })


  }

  socialSignup(socialPlatform: string) {
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
