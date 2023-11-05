import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  ProjectService,
  ActivityService,
  NotificationService
} from "../../_services";
import { AuthStore }
  from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  Router,
  ActivatedRoute
} from "@angular/router";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

declare var google: any;
@Component({
  selector: "app-invitedSignup",
  templateUrl: "./invitedSignup.component.html",
  styleUrls: [
    "./invitedSignup.component.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class InvitedSignupComponent implements OnInit, AfterViewInit {
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

  project;
  checkData = null;
  errMessage = "";

  msg = {
    strJoin: "",
    strProject: ""
  }

  constructor(
    private socialAuthService: SocialAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authSrv: AuthStore,
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private projectSrv: ProjectService,
    private activitySrv: ActivityService,
    private translateSrv: TranslateService,
    private notificationSrv: NotificationService
  ) {

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.init_terms(_lang)
    } else {
      this.init_terms('en')
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms(lang)
      }
    });
  }

  ngOnInit() {

    this.projectId = this.route.snapshot.queryParams.projectId;
    this.email = this.route.snapshot.queryParams.email;
    this.name = this.route.snapshot.queryParams.name;
    this.invitationId = this.route.snapshot.queryParams.id;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signupForm = this.fb.group({
      name: [this.name, Validators.required],
      email: [this.email, [Validators.required, Validators.pattern(emailRegex)]],
      password: ["", Validators.required],
    });

    this.projectSrv.getProject(this.projectId, null).then(res => {
      if (res['result'] == 'successful') {

        if (res["result"] == 'successful') {
          this.project = res["data"];
        }
      }
    }).then(() => {

    })

    this.authSrv.getCheckData().then(res => {
      if (res['result'] == 'successful') {
        this.checkData = res['data'];
      }
    }).catch(error => {
      console.error("check data failed", error);
    })
  }

  init_terms(lang) {
    this.translateSrv.get("JOIN").subscribe((text: string) => {
      this.msg.strJoin = text;
    });

    this.translateSrv.get("PROJECT").subscribe((text: string) => {
      this.msg.strProject = text;
    });


  }



  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: "1093364473991-70t3haupsjd78sekbn2lkjrqlb5oo6c8.apps.googleusercontent.com",
      ux_mode: "popup",
      callback: (response: any) => this.handleGoogleSignIn(response)
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      {
        theme: 'outline',

        text: "透過 Google 登入"
      }  // customization attributes
    );

  }

  socialSignIn2() {
    let btn = <HTMLElement>document.querySelector("div[role=button]");
    if (btn instanceof HTMLElement) {
      (<HTMLElement>document.querySelector("div[role=button]")).click();
    }

  }

  handleGoogleSignIn(response: any) {


    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    var userData = JSON.parse(jsonPayload);

    this.authSrv.socialInvitedSignup(
      this.invitationId,
      this.projectId,
      userData.id,
      userData.name,
      userData.email,
      userData.idToken,
      'google').subscribe(result => {

        if (result['result'] === 'successful') {
          const user = result['data'];
          if (user !== undefined) {

            if (user.firstTime !== 1) {
              localStorage.setItem("access_token", result["token"]);
              localStorage.setItem("auth_data", JSON.stringify(user));
              this.router.navigate(["./dashboard"], {});
            } else if (user.firstTime === 1) {
              localStorage.setItem('token', result['token']);
              localStorage.setItem('auth_data', JSON.stringify(user));
              this.router.navigate(["./info"], {});
            }

          }

        } else if (result['error']) {
          console.log(result['error']);
        }
      }, error => console.error('Error :', error));

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

        if (res['result'] == 'successful') {

          this.notification(res['data']["id"], values.name, this.projectId);

          this.router.navigate(["./info"], {});
        } else {

        }
      })


  }

  socialSignUp(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {

        this.authSrv.socialInvitedSignup(
          this.invitationId,
          this.projectId,
          userData.id,
          userData.name,
          userData.email,
          userData.idToken,
          socialPlatform).subscribe(result => {

            if (result['result'] === 'successful') {
              const user = result['data'];
              if (user !== undefined) {

                if (user.firstTime !== 1) {
                  localStorage.setItem("access_token", result["token"]);
                  localStorage.setItem("auth_data", JSON.stringify(user));
                  this.router.navigate(["./dashboard"], {});
                } else if (user.firstTime === 1) {
                  localStorage.setItem('token', result['token']);
                  localStorage.setItem('auth_data', JSON.stringify(user));
                  this.router.navigate(["./info"], {});
                }

              }

            } else if (result['error']) {
              console.log(result['error']);
            }
          }, error => console.error('Error :', error));

      }
    ).catch(error => {
      console.error('socialSignUp Error:', error);
    });
  }

  notification(userId, usernName, projectId) {
    this.activitySrv.insert(userId,
      projectId,
      "join",
      `${usernName} ${this.msg.strJoin} ${this.project.name}${this.msg.strProject}！`
    ).subscribe(res => {
      if (res['result'] === 'successful') { }
    });

    this.notificationSrv.infoProjectMembers(projectId,
      userId,
      `${usernName} ${this.msg.strJoin} ${this.project.name}${this.msg.strProject}！`,
      "1",
      '0',
      '0',
      userId
    ).then(res => {
      if (res['result'] === 'successful') {

      }
    })
  }

}
