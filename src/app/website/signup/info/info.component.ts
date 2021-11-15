import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,

  AuthStore
} from "../../../_services";
import { Utility } from "../../../_helpers";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";

import {
  Router,
  ActivatedRoute
} from "@angular/router";
@Component({
  selector: "app-signup-info",
  templateUrl: "./info.component.html",
  styleUrls: [
    "./info.component.css",
  ]
})
export class SignupInfoComponent implements OnInit {
  width = false;
  loginForm: FormGroup;
  submitted = false;

  profileImage = null;
  profileImageFile = null;
  step = 0;

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

  NextStep(value) {
    this.step = value;
  }

  onDetectImage(event) {
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.profileImageFile = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.profileImage = reader.result;
    }
  }
  onRemoveImg(event) {
    this.profileImage = null;
    this.profileImageFile = null;
  }
}
