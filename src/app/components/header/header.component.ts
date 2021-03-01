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
  UserService,
  Web3Service,
  DataService,
} from "../../_services";
import { User } from "./../../_models/user";

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

  constructor(
    private utility: Utility,
    private fb: FormBuilder,
    private translateSrv: TranslateService,
    private userSrv: UserService,
    private web3Srv: Web3Service,
    private dataSrv: DataService,
    private router: Router,
    private route: ActivatedRoute,
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
  }

  close() {

  }
  onSignIn() {

    // this.closeModal.nativeElement.click();
    //  this.closeModal['el'].nativeElement.style.display = 'none';
    //  this.closeModal['el'].nativeElement.classList.add('sshow');
    this.IsSignInFailed = false;
    const val = this.signinEmailForm.value;

    this.authStoreSrv.login(val.email, val.password).subscribe(
      (res) => {
        if (res["result"] === "successful") {
          this.closebutton.nativeElement.click();
          console.log("auth", this.authStoreSrv.isLoggedOut$);
          this.currentUser = this.authStoreSrv.getUserData();
          console.log(" this.currentUser", this.currentUser);
        } else {
          this.IsSignInFailed = true;
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
          this.authStoreSrv.walletSignin(data.address).subscribe((result) => {
            console.log(" walletSignin =============== ");
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
    let _password = this.signinEmailForm.value.password;
    if (!this.utility.IsNullOrEmpty(_password)) {
      const val = this.signinEmailForm.value;

      this.authStoreSrv.login(val.emai, val.password).subscribe(
        () => { },
        (err) => {
          alert("Sign in failed!");
        }
      );
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
    }
  }

  Signout() {
    this.authStoreSrv.logout();
    this.router.navigate(['./index'], {});
  }
  onSubmit() {
    // if (this.loginForm.invalid) {
    //   return;
    // }
    // console.log("====================");
    // let password = this.loginForm.value.password;
    // if (!this.utility.IsNullOrEmpty(password)) {
    //   const salt = bcrypt.genSaltSync(10);
    //   let pass = bcrypt.hashSync(password, 10);
    //   console.log("====================", pass);
    //   this.userSrv
    //     .signup(this.loginForm.value.email, pass, "", "")
    //     .subscribe((result) => {
    //       console.log("====================", result);
    //     });
    //  const verified = bcrypt.compareSync('123456', '$2b$10$CTeKHXon1D7VGeJlY7bXR.JkuMWJgZcDRVEoHnj2H/5LmFZZsrztm');
    //  console.log("verified ====================",verified);
    //  bcrypt.hash(pass, 10, function(err, hash) {
    //   console.log("hash ====================",hash);
    // });
    //  }
    // var res = this.AuthService.login(this.loginForm.value.email, this.loginForm.value.password)
    // // console.log(res);
    // res.subscribe(result => {
    //   // console.log("result", result);
    //   if (result["data"] == undefined) {
    //     this.InvalidUser = true;
    //   } else {
    //     localStorage.setItem("id", result["data"]["id"]);
    //     this.router.navigate(['/userpage']);
    //   }
    // });
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
}
