import { Component, OnInit, HostListener } from "@angular/core";
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
  signupForm: FormGroup;
  submitted = false;

  InvalidUser = false;
  unverifiedUser = false;
  GooglePlusNotExist = false;
  nameExistant = false;
  emailExistant = false;

  checkData = null;
  errMessage = ""

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
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {


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

  inValid() {
    return this.signupForm.invalid;
  }

  onSubmit() {


    // this.router.navigate(["./profile/Christian"], {});
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

  socialSignIn(socialPlatform: string) {
    console.log("socialSignIn =========", socialPlatform);
    this.authSrv.socialSignIn(socialPlatform).then(res => {
      console.log(" =========", res);
      // this.router.navigate(["./profile/" + res['data'].id], {});
      this.router.navigate(["./info"], {});
    });

  }

}
