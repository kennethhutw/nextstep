import { Component, OnInit, HostListener, ChangeDetectorRef } from "@angular/core";
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
import {
  Router,
  ActivatedRoute
} from "@angular/router";
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: [
    "./signin.component.css",
  ]
})
export class SigninComponent implements OnInit {
  width = false;
  loginForm: FormGroup;
  submitted = false;

  invalidUser = false;
  unverifiedUser = false;
  GooglePlusNotExist = false;

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
    private changeDetectorRef: ChangeDetectorRef,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {


  }

  ngOnInit() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(emailRegex)]],
      password: ["", Validators.required],
    });
  }

  inValid() {
    return this.loginForm.invalid;
  }

  onSubmit() {
    this.submitted = true;
    const value = this.loginForm.value;

    this.authSrv.login(value.email, value.password).subscribe(
      (res) => {
        if (res["result"] === "successful") {
          this.router.navigate(["./dashboard/dashboard"], {});

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
    console.log("socialSignIn =========", socialPlatform);
    this.authSrv.socialSignIn(socialPlatform).then(res => {
      console.log(" =========", res);
      this.router.navigate(["./profile/" + res['data'].id], {});
    });

  }
}
