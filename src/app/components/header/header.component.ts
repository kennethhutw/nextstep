import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utility } from "../../_helpers";
import { Router, ActivatedRoute } from "@angular/router";
import {
  AuthStore,
  ToastService,
  Web3Service,
  DataService,
  EmailService,
  UserService
} from "../../_services";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
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
  constructor(
    private utility: Utility,
    private fb: FormBuilder,
    private userSrv: UserService,
    private translateSrv: TranslateService,
    private toastSrv: ToastService,
    private web3Srv: Web3Service,
    private dataSrv: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private emailSrv: EmailService,
    public authStoreSrv: AuthStore
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {
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
    console.log("  this.currentUser ", this.currentUser);
    this.authStoreSrv.user$.subscribe(user => { this.currentUser = user });
  }

  close() {

  }


  onSignIn() {

    // this.closeModal.nativeElement.click();
    //  this.closeModal['el'].nativeElement.style.display = 'none';
    //  this.closeModal['el'].nativeElement.classList.add('sshow');
    this.IsSignInFailed = false;
    const val = this.signinEmailForm.value;
    this.LoginFailedMsg = "Incorrect email or password.";

    this.authStoreSrv.login(val.email, val.password).subscribe(
      (res) => {
        if (res["result"] === "successful") {
          this.closebutton.nativeElement.click();

          this.currentUser = this.authStoreSrv.getUserData();

          console.log(" this.currentUser", this.currentUser);
          if (this.currentUser.firstTime == 1) {
            this.userSrv.setFirstTime(this.currentUser.id, "0").subscribe(res => {
              console.log(" setFirstTime", res);
            }, error => {
              console.log(" setFirstTime", error);
            });
          }

          if (this.currentUser.roles.artist) {
            if (this.currentUser.firstTime == 1) {
              this.currentUser.firstTime = 0;
              this.authStoreSrv.setUserData(this.currentUser);
              this.router.navigate(['/artist/account'], {});
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
  }

  inValid() {
    return this.signinEmailForm.invalid;
  }

  walletSignup() {
    // if (this.web3Srv.ethEnabled()) {
    //   this.web3Srv.getAccountDetail().then(
    //     (data) => {
    //       console.log("User", data);
    //       this.userSrv.walletSignin(data.address).subscribe((result) => {});
    //     },
    //     (error) => {
    //       console.log("getAccountDetail error", error);
    //     }
    //   );
    // } else {
    //   console.warn("Metamask not found Install or enable Metamask");
    // }
  }

  walletSignin() {

    if (this.web3Srv.ethEnabled()) {
      this.web3Srv.getAccountDetail().then(
        (data) => {
          this.authStoreSrv.walletSignin(data.address, "collector").subscribe((result) => {
            this.currentUser = this.authStoreSrv.getUserData();
            if (this.currentUser) {
              this.authStoreSrv.user$.subscribe(user => { this.currentUser = user });
            }
          },
            errorMsg => {
              console.log('error', errorMsg);
            });
        },
        (error) => {
          console.log("getAccountDetail error", error);
        }
      );
    } else {
      console.warn("Metamask not found Install or enable Metamask");
    }
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



  GoToNextPage(pageName) {
    this.router.navigate(["/register-artist"]);
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
    let url = '/setPassword';
    let link = domain + url;
    this.pswloading = true
    this.emailSrv.sendResetPasswordEmail(
      'Reset your password for FormosaArt',
      this.ForgotPasswordEmail,
      link).subscribe(sendRes => {
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
}
