import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, EmailService } from '../../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-setPassword',
  templateUrl: './setPassword.component.html',
  styleUrls: ['./setPassword.component.css']
})
export class SetPasswordComponent implements OnInit {
  Form: FormGroup;
  message = '';
  submitted = false;
  uid: string;
  time: number;
  email: string;
  created: number;
  current: Date;
  timeDiff: number;

  clickedText = false;
  isVerify = true;
  loading = false;
  role: string = '';

  have1Lower = true;
  have1Upper = true;
  haveNumber = true;
  have8Char = true;
  isSent = false;

  IsCanResetPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userSrv: UserService,
    private emailSrv: EmailService
  ) {
    this.current = new Date();
  }

  ngOnInit() {

    this.Form = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]],
      newPassword2: ['', [Validators.required]]
    });

    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'];
      this.time = params['time'];
      this.timeDiff = this.current.getTime() - this.time;
      if (this.timeDiff > 1800000) {
        this.IsCanResetPassword = false;
        this.message = "This is expired! Please resend reset e-mail."
      }

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
      let url = '/setPassword';
      let link = domain + url;
      this.emailSrv.sendResetPasswordEmailByUid(
        'Reset your password for Formosa Art',
        this.uid,
        link).subscribe(sendRes => {
          if (sendRes['result'] == 'successful') {
            this.isSent = true;
            this.loading = false;
          } else {
            this.isSent = true;
            this.loading = false;
          }
          // this.msg = true;
          // this.message = 'E-mail has been sent to reset your password.';
        });
    } catch (error) {
      console.error('resendEmail : ', error);
      this.loading = false;
    }
  }

  onSubmit() {

  }

  onValueChange(value) {

    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    if (lowerCaseLetters.test(value)) {
      this.have1Lower = true;
    } else {
      this.have1Lower = false;
    }

    if (upperCaseLetters.test(value)) {
      this.have1Upper = true;
    } else {
      this.have1Upper = false;
    }

    if (numbers.test(value)) {
      this.haveNumber = true;
    } else {
      this.haveNumber = false;
    }

    if (value.length >= 8) {
      this.have8Char = true;
    } else {
      this.have8Char = false;
    }
  }
}
