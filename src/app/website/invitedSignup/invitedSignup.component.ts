import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,

} from "../../_services";
import { AuthStore }
  from "../../_services/auth.store";
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
  selector: "app-invitedSignup",
  templateUrl: "./invitedSignup.component.html",
  styleUrls: [
    "./invitedSignup.component.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class InvitedSignupComponent implements OnInit {
  projectId = "";
  email = "";
  name = "";
  invitationId = "";
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


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authSrv: AuthStore,
    private utility: Utility,
    private dataSrv: DataService
  ) {


  }

  ngOnInit() {
    console.log(" this.invitationId ========== ");
    this.projectId = this.route.snapshot.queryParams.projectId;
    this.email = this.route.snapshot.queryParams.email;
    this.name = this.route.snapshot.queryParams.name;
    this.invitationId = this.route.snapshot.queryParams.id;
    console.log(" this.invitationId ========== ", this.invitationId);
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signupForm = this.fb.group({
      name: [this.name, Validators.required],
      email: [this.email, [Validators.required, Validators.pattern(emailRegex)]],
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
    this.authSrv.invitedSignup(this.invitationId,
      this.projectId,
      values.name,
      values.email,
      values.password).subscribe(res => {
        console.log("==============", res);
        if (res['result'] == 'successful') {
          this.router.navigate(["./info"], {});
        } else {

        }
      })


  }

  socialSignIn(socialPlatform: string) {
    this.authSrv.socialSignIn(socialPlatform).then(res => {
      // this.router.navigate(["./profile/" + res['data'].id], {});
      this.router.navigate(["./info"], {});
    });

  }

}
