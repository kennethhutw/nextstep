import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utility } from "../../_helpers";
import { Router, ActivatedRoute } from "@angular/router";
import {
  DataService,
  EmailService,
  UserService,
  NotificationService,
  ToastService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";

import { interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  signinEmailForm: FormGroup;
  currentUser: any = null;
  placeholder = '';
  IsSignInFailed = false;
  LoginFailedMsg = "Incorrect email or password.";
  ForgotPasswordEmail = "";

  pswMsgFailed = true;
  pswActionMsg = "";
  pswloading = false;
  DemoSite = "";
  collectorStep = 0;
  artistStep = 0;
  uid = "";

  notiNum = 0;
  msgNum = 0;
  notis;

  SelectedLang = "en";
  msg = {
    logout: ""
  }
  constructor(
    private utility: Utility,
    private fb: FormBuilder,
    private userSrv: UserService,
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private router: Router,
    private notificationSrv: NotificationService,
    private emailSrv: EmailService,
    public authStoreSrv: AuthStore,
    private toasterSrv: ToastService,
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.SelectedLang = _lang;
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms();
      }
    });
    this.init_terms();


  }

  ngOnInit() {

    if (environment.environment !== "production") {
      this.DemoSite = "This is a demo site.";
    }
    this.signinEmailForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
    this.translateSrv.get("EMAILSIGNIN").subscribe((text: string) => {
      this.setPlaceholder("#emailsignin", text);
    });

    this.currentUser = this.authStoreSrv.getUserData();
    if (!!this.currentUser) {
      this.uid = this.currentUser.uid;
      if (!this.utility.IsNullOrEmpty(this.currentUser.imageUrl)) {
        this.currentUser.imageUrl = environment.assetUrl + this.currentUser.imageUrl;
      }
    }


    this.authStoreSrv.user$.subscribe(user => {
      this.currentUser = user
    });
    if (this.uid) {
      this.notificationSrv.getFirstFiveNotifications(this.currentUser.id).then(res => {
        if (res['result'] == 'successful') {
          this.notis = res['data'];
          this.notiNum = res['unRead'];
          this.msgNum = res['msgUnReadNum'];
        }
      }).catch(error => {
        console.log("getNotifications ", error);
      })
    }

    this.authStoreSrv.logoutState.subscribe(value => {
      if (value == 2) {
        this.toasterSrv.showToast("", this.msg.logout, this.toasterSrv.iconClasses.info);
      }
    })
  }

  init_terms() {
    this.translateSrv.get("LOGOUT").subscribe((text: string) => {
      this.msg.logout = text;
    });
  }

  logoRedirect() {
    if (!this.currentUser) {
      this.router.navigate(['./index'], {});
    } else {
      this.router.navigate(['./dashboard'], {});
    }
  }

  close() {

  }

  notification() {

    interval(2 * 60 * 1000)
      .pipe(
        mergeMap(() => this.notificationSrv.getNotifications(this.currentUser.id))
      )
      .subscribe(data => console.log(data))

  }

  onSignIn() {

    this.IsSignInFailed = false;
    const val = this.signinEmailForm.value;
    this.LoginFailedMsg = "Incorrect email or password.";

    this.authStoreSrv.login(val.email, val.password).subscribe(
      (res) => {
        if (res["result"] === "successful") {
          this.closebutton.nativeElement.click();

          this.currentUser = this.authStoreSrv.getUserData();
          this.uid = this.currentUser.uid;

          if (this.currentUser.firstTime == 1) {
            this.userSrv.setFirstTime(this.currentUser.id, "0").subscribe(res => {

              this.currentUser.firstTime = 0;
              this.authStoreSrv.setUserData(this.currentUser);
            }, error => {
              console.log(" setFirstTime", error);
            });

            if (this.currentUser.roles.collector) {
              document.getElementById("openCollectorheaderModalButton").click();
            }
            if (this.currentUser.roles.artist) {
              document.getElementById("openArtistModalButton").click();
            }
          }

        } else {
          this.IsSignInFailed = true;
          this.LoginFailedMsg = res["message"];
        }
      },
      (err) => {
        console.log(" Sign in failed! ", err);
        this.IsSignInFailed = true;
        // alert("Sign in failed!");
      }
    );
  }

  logout() {
    this.authStoreSrv.logout();
    this.router.navigate(['./index'], {});
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
    this.dataSrv.setLang(lang);
    localStorage.setItem("lang", lang);
    this.SelectedLang = lang;
  }

  inValid() {
    return this.signinEmailForm.invalid;
  }

  emailsignin() {
    // let _password = this.signinEmailForm.value.password;
    // if (!this.utility.IsNullOrEmpty(_password)) {
    //   const val = this.signinEmailForm.value;

    //   this.authStoreSrv.login(val.emai, val.password).subscribe(
    //     () => { },
    //     (err) => {
    //       alert("Sign in failed!");
    //     }
    //   );
    // this.userSrv
    //   .getPassWordByEmail(this.signinEmailForm.value.email)
    //   .then((res) => {
    //     if (res["result"] === "successful") {
    //       const verified = bcrypt.compareSync(
    //         _password,
    //         res["data"]["password"]
    //       );
    //       if (verified) {
    //         localStorage.setItem("currentUser", JSON.stringify(res.data));
    //         this.currentUser = res.data;
    //       }
    //     }
    //   });
    // }
  }

  Signout() {
    this.authStoreSrv.logout();
    this.router.navigate(['./index'], {});
  }

  setBlur(id, key) {
    this.translateSrv.get(key).subscribe((text: string) => {
      this.setPlaceholder("#" + id, text);
    });
  }

  setPlaceholder(elementName, value) {
    document.querySelector(elementName).setAttribute("placeholder", value);
  }

  onResetPassword() {

    this.pswMsgFailed = true;
    this.pswActionMsg = "";
    let domain = window.location.origin;
    let url = '/resetPassword';
    let link = domain + url;
    this.pswloading = true
    this.emailSrv.sendResetPasswordEmail(
      'Reset your password for FormosaArt',
      this.ForgotPasswordEmail,
      link).subscribe(sendRes => {
        console.log("sendRes", sendRes);
        if (sendRes['result'] == 'successful') {
          this.pswActionMsg = sendRes['message'];
        } else {
          this.pswMsgFailed = false;
          this.pswActionMsg = sendRes['message'];
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        this.pswMsgFailed = false;
        this.pswActionMsg = error.message;
      }, () => {
        this.pswloading = false;
      });
  }

  onNext() {
    this.artistStep += 1;
  }

  onCollectorNext() {
    this.collectorStep += 1;
  }


  ToggleNavBar() {

    let element: HTMLElement = document.getElementsByClassName('navbar-toggler')[0] as HTMLElement;
    if (element.getAttribute('aria-expanded') == 'true') {
      element.click();
    }

  }

  RouteToNewProject() {
    if (!this.currentUser) {
      this.router.navigate(['/signin', { first: 'true' }], {});
    } else {
      this.router.navigate(['/newProject', { first: 'true' }], {});
      let element: HTMLElement = document.getElementsByClassName('navbar-toggler')[0] as HTMLElement;
      if (element.getAttribute('aria-expanded') == 'true') {
        element.click();
      }
    }
  }
  onImgError(event) {
    event.target.src = "assets/images/defaultProjectIcon.png";
  }
}
