import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  UserService,
  AuthStore
} from "../../_services";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from "@angular/router";
import { Utility } from "../../_helpers";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [
    "./login.component.css",
  ]
})
export class LoginComponent implements OnInit {
  signinEmailForm: FormGroup;
  currentUser: any;
  IsSignInFailed = false;
  LoginFailedMsg = "";
  submitted = false;
  loading = false;

  showModalBox: boolean = false;

  artistStep = 0;
  collectorStep = 0;

  @ViewChild('content') content: any;
  constructor(
    private utility: Utility,
    private fb: FormBuilder,
    private userSrv: UserService,
    private router: Router,
    private route: ActivatedRoute,

    public authStoreSrv: AuthStore,
    private translateSrv: TranslateService,

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

  ngOnInit() {
    let _lang = localStorage.getItem("lang");

    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    } else {
      this.translateSrv.use("en");
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

  }

  get f() {
    return this.signinEmailForm.controls;
  }
  inValid() {
    return this.signinEmailForm.invalid;
  }

  setPlaceholder(elementName, value) {
    document.querySelector(elementName).setAttribute("placeholder", value);
  }

  onSignIn() {
    console.log("===========");
    // this.closeModal.nativeElement.click();
    //  this.closeModal['el'].nativeElement.style.display = 'none';
    //  this.closeModal['el'].nativeElement.classList.add('sshow');
    this.IsSignInFailed = false;
    const val = this.signinEmailForm.value;
    this.LoginFailedMsg = "Incorrect email or password.";

    this.authStoreSrv.login(val.email, val.password).subscribe(
      (res) => {
        if (res["result"] === "successful") {

          this.currentUser = this.authStoreSrv.getUserData();

          if (this.currentUser.firstTime == 1) {
            this.userSrv.setFirstTime(this.currentUser.id, "0").subscribe(res => {
              console.log(" setFirstTime", res);
            }, error => {
              console.log(" setFirstTime", error);
            });
          }

          if (this.currentUser.roles.artist) {
            this.currentUser.firstTime = 0;
            this.authStoreSrv.setUserData(this.currentUser);
            // this.router.navigate(['/artist/account'], {});
            document.getElementById("openModalButton").click();
          } else if (this.currentUser.roles.collector) {
            document.getElementById("openCollectorModalButton").click();
          } else {
            this.router.navigate(['/'], {});
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

  onClick() {
    document.getElementById("openModalButton").click();
  }

  onClick2() {
    document.getElementById("openCollectorModalButton").click();
  }
  onNext() {
    this.artistStep += 1;
  }

  onCollectorNext() {
    this.collectorStep += 1;
  }

  GotoArtist() {
    this.collectorStep = 0;
    this.artistStep = 0;

    this.router.navigate(['/artist/account'], {});
  }

  GotoCollector() {
    this.collectorStep = 0;
    this.artistStep = 0;

    this.router.navigate(['/collector/account'], {});
  }


}
