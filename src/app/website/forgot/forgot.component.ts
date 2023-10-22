import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  EmailService,
  ToastService
} from "../../_services";
import { Utility } from "src/app/_helpers";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Subscription, timer, } from 'rxjs';

import { map, take } from 'rxjs/operators';

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: [
    "./forgot.component.scss",
  ]
})
export class ForgotComponent implements OnInit {
  width = false;
  resetEmailForm: FormGroup;
  submit = false;

  InvalidUser = false;
  unverifiedUser = false;
  submitted = false;
  showSPAMmsg = false;
  errorMsg = "";
  public timerSub: Subscription;
  public value: number = 0;


  constructor(
    private fb: FormBuilder,
    private emailSrv: EmailService,
    private toastSrv: ToastService,
    private utilitySrv: Utility,
    private translateSrv: TranslateService,
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }

  }

  ngOnInit() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.resetEmailForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(emailRegex)]]
    });
  }

  inValid() {
    if (this.submitted) {
      return true;
    }
    if (!this.submitted) {
      return this.resetEmailForm.invalid;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.showSPAMmsg = true;
    this.hideErrorMsg();
    let domain = window.location.origin;
    let url = '/resetPassword';
    let link = domain + url;
    const values = this.resetEmailForm.value;
    this.emailSrv.sendResetPasswordEmail(
      'Reset your password for NextStep',
      values.email,
      link).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.startTimer();
          this.submitted = false;

        } else {
          this.errorMsg = sendRes['message'];
          this.submitted = false;
        }

      }, error => {
        console.error(` sendResetEmail error`, error);

        this.submitted = false;
      });

  }

  hideErrorMsg() {
    this.errorMsg = "";
  }


  startTimer() {
    // For demonstration purposes
    const startValue = 1 * 60;

    this.timerSub = timer(0, 1000).pipe(
      take(startValue + 1),
      map(value => startValue - value)
    ).subscribe(
      value => this.value = value,
      null,
      () => this.timerSub = null
    );
  }
}
