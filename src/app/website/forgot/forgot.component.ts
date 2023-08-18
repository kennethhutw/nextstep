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


  public timerSub: Subscription;
  public value: number = 0;

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
    return this.resetEmailForm.invalid;
  }

  onSubmit() {

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
          this.toastSrv.showToast('Success', "Reset Email Sent", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }

      }, error => {
        console.error(` sendResetEmail error`, error);
        this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });

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
