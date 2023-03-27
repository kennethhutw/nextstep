import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService, EmailService } from '../../_services';

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
import { Subscription, timer, } from 'rxjs';
import { map, take } from 'rxjs/operators';
@Component({
  selector: "app-reset-password",
  templateUrl: "./resetPassword.component.html",
  styleUrls: [
    "./resetPassword.component.scss",
  ]
})
export class ResetPasswordComponent implements OnInit {
  ResetForm: FormGroup;
  message = '';
  submitted = false;
  uid: string;
  time: number;
  email: string;
  created: number;
  current: Date;
  timeDiff: number;

  oldPSW = "";
  newPSW = "";
  confirmPSW = "";
  submittedPSW = false;
  pswActionMsg = null;
  pswMsgFailed = false;

  clickedText = false;
  isVerify = true;
  loading = false;
  role: string = '';

  have8Char = true;
  isSent = false;

  IsCanResetPassword = true;

  public timerSub: Subscription;
  countDownValue: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userSrv: UserService,
    private translateSrv: TranslateService,
    private emailSrv: EmailService,
    private utility: Utility
  ) {
    this.current = new Date();
  }

  ngOnInit() {

    this.ResetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      newPassword2: ['', [Validators.required]]
    });

    this.route.queryParams.subscribe(params => {

      this.uid = params['uid'];
      this.time = params['time'];
      this.timeDiff = this.current.getTime() - this.time;
      if (this.timeDiff > 1800000) {
        this.IsCanResetPassword = false;
        this.pswActionMsg = "This is expired! Please resend reset e-mail.";
        this.pswMsgFailed = true;
        this.startTimer();
      }

    });

  }

  startTimer() {
    // For demonstration purposes
    const startValue = 1 * 10;

    this.timerSub = timer(0, 1000).pipe(
      take(startValue + 1),
      map(value => startValue - value)
    ).subscribe(
      value => this.countDownValue = value,
      null,
      () => {
        this.timerSub = null;
        this.GoHomePage()
      }
    );
  }

  GoHomePage() {
    this.router.navigate(['./'], {

    });
  }

  NextPage() {
    this.router.navigate(['./index'], {
      queryParams: {
        role: this.role
      }
    });
  }

  resendEmail() {
    this.loading = true;
    this.isSent = false;
    try {
      let domain = window.location.origin;
      let url = '/resetPassword';
      let link = domain + url;
      this.emailSrv.sendResetPasswordEmailByUid(
        'Reset your password',
        this.uid,
        link).subscribe(sendRes => {
          if (sendRes['result'] == 'successful') {
            this.isSent = true;
            this.loading = false;
          } else {
            this.isSent = true;
            this.loading = false;
          }
        });
    } catch (error) {
      console.error('resendEmail : ', error);
      this.loading = false;
    }
  }

  get f() {
    return this.ResetForm.controls;
  }

  onSubmit() {

    try {
      this.submittedPSW = true;
      this.pswActionMsg = null;
      this.pswMsgFailed = false;
      if (this.ResetForm.value.newPassword !== this.ResetForm.value.newPassword2) {
        this.pswActionMsg = "Password are not match";
        this.pswMsgFailed = true;
        return;
      }

      if (this.utility.IsNullOrEmpty(this.uid)) {
        return
      }

      let _password = this.ResetForm.value.newPassword;

      this.userSrv.setPassword(_password,
        this.uid).subscribe(res => {

          if (res["result"] === "successful") {
            this.router.navigate(['/signin']);
            this.submittedPSW = false;
            this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
              this.pswActionMsg = text;
              this.ResetForm.reset();
            });
          } else {
            this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
              this.pswActionMsg = text;
              this.pswMsgFailed = true;
            });
          }
        }, error => {
          this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
            this.pswActionMsg = text;
            this.pswMsgFailed = true;
          });
          console.error(`setPassword failed : `, error);
        })

    }
    catch (error) {
      console.warn(`changePassword `, error);
      this.submittedPSW = false;
    }

  }
  inValid() {
    return this.ResetForm.invalid;
  }
  onValueChange(value) {


    const numbers = /[0-4]/g;

    if (value.length >= 8) {
      this.have8Char = true;
    } else {
      this.have8Char = false;
    }
  }

}
