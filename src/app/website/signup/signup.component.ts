import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  PromoService,
  AuthStore
} from "../../_services";
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
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: [
    "./signup.component.css",
  ]
})
export class SignupComponent implements OnInit {
  width = false;
  loginForm: FormGroup;
  submitted = false;

  InvalidUser = false;
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
    private promoSrv: PromoService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {


  }

  ngOnInit() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(emailRegex)]],
      password: ["", Validators.required],
    });
  }

  inValid() {
    return this.loginForm.invalid;
  }

  onSubmit() {
    this.router.navigate(["./profile/Christian"], {});
  }

  socialSignIn(socialPlatform: string) {
    console.log("socialSignIn =========", socialPlatform);
    this.authSrv.socialSignIn(socialPlatform).then(res => {
      console.log(" =========", res);
      this.router.navigate(["./profile/" + res['data'].id], {});
    });

  }

}
