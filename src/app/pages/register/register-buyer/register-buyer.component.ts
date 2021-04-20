import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { Utility } from "./../../../_helpers";
import { Web3Service, DataService, AuthStore } from "../../../_services";
import { Router } from "@angular/router";

@Component({
  selector: "app-register-buyer",
  templateUrl: "./register-buyer.component.html",
  styleUrls: ["./register-buyer.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterBuyerComponent implements OnInit {
  wellatAddress = "";
  IsAgree = false;
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  registerType = 0;

  errorMsg = "";

  constructor(
    private router: Router,
    private auth: AuthStore,
    private formBuilder: FormBuilder,
    private web3Srv: Web3Service,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
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

  get f() {
    return this.registerForm.controls;
  }

  inValid() {
    return this.registerForm.invalid;
  }

  ngOnInit() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.registerForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
    localStorage.clear();
  }

  WellectConnect() {
    if (this.web3Srv.ethEnabled()) {
      this.web3Srv.getAccountDetail().then(
        (data) => {
          console.log("User", data);
          if (data.address) this.wellatAddress = data.address;
        },
        (error) => {
          console.log("getAccountDetail error", error);
        }
      );
    } else {
      console.warn("Metamask not found Install or enable Metamask");
    }
  }

  IsEnableEmailSignup() {
    if (this.registerType == 1) {
      return true;
    }
    return false;
  }

  IsEnableWalletSignup() {
    if (this.registerType == 0) {
      return true;
    }
    return false;
  }

  register() {
    //I have read, understand and agree to MeWe´s Privacy Policy and Terms of Service
    this.submitted = true;
    this.errorMsg = "";

    if (this.registerType === 0) {
      if (this.registerForm.invalid) {
        return;
      }
      this.loading = true;
      this.auth
        .signup(
          this.registerForm.value.email,
          this.registerForm.value.password,
          "collector"
        )
        .subscribe(
          (res) => {
            if (res["result"] === "successful") {
              const _user = res["data"];
              this.auth.setUserData(_user);
              localStorage.setItem("token", res["token"]);
              let AuthEmailRes = this.auth.sendAuthEmail(_user['id'], this.registerForm.value.email);
              // this.auth.sendAuthEmail(_user['id'], this.registerForm.value.email);
              // redirect to profile
              AuthEmailRes.subscribe(_res => {
                if (_res['result'] = 'successful') {
                  this.router.navigate(["collector/account/"], {});
                }
              });

            } else {
              this.errorMsg = res["message"];
            }
            this.loading = false;
          },
          (error) => {
            //  this.alertService.error(error);
            console.error("Sign up failed! " + error);
            this.loading = false;
          }
        );
    } else {
      this.auth.walletSignup(this.wellatAddress, "collector").subscribe(
        (res) => {
          if (res["result"] === "successful") {
            const _user = res["data"];
            localStorage.setItem("currentUser", JSON.stringify(_user));
            localStorage.setItem("token", res["token"]);
            // redirect to profile
            this.router.navigate(["profile/collector/" + _user["id"]], {});
          } else {
            this.errorMsg = res["message"];
          }
          this.loading = false;
        },
        (error) => {
          //  this.alertService.error(error);
          console.error("Sign up failed! " + error);
          this.loading = false;
        }
      );
    }
  }
}
