import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, EmailService } from '../../_services';


@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userSrv: UserService,
    private emailSrv: EmailService
  ) {
    this.current = new Date();
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'];
      this.time = params['time'];
      this.role = params['role'];
      this.timeDiff = this.current.getTime() - this.time;
      if (this.uid !== null && this.timeDiff < 1800000) {
        let res = this.userSrv.confirmVerifiedEmail(this.uid, "1");

        res.subscribe(result => {
          if (result['result'] !== 'successful') {
            this.isVerify = false;
          }
        });
      }

      this.userSrv.getUserEmailByUid(this.uid).then(res => {
        if (res['result'] == 'successful') {
          this.email = res['data'];
        }
      })
    });

  }

  NextPage() {
    this.router.navigate(['./signin'], {
      queryParams: {
        role: this.role
      }
    });
  }

  resendEmail() {
    this.loading = true;
    try {
      let domain = window.location.origin;
      let url = '/verifyEmail';
      let link = domain + url;
      this.emailSrv.authenticateEmail(
        'Welcome to the FormosArt platform!',
        this.email,
        link,
        this.uid,
      ).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.clickedText = true;
          this.loading = false;
        } else {
          this.clickedText = true;
          this.loading = false;
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      });
    } catch (error) {
      console.error('verifyEmail : ', error);
      this.loading = false;
    }
  }

}
