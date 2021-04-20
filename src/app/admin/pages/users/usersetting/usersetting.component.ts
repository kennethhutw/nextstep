import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  UserService,
  AuthStore,
  ToastService,
  EmailService
} from '../../../../_services';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  ActivatedRoute
} from "@angular/router";

@Component({
  selector: 'app-usersetting',
  templateUrl: './usersetting.component.html',
  styleUrls: ['./usersetting.component.css']
})
export class UserSettingComponent implements OnInit {

  editedUser: any;
  constructor(
    private emailSrv: EmailService,
    private toastSrv: ToastService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
    private userSrv: UserService
  ) { }

  ngOnInit() {
    // this.toastSrv.showToast('Success', "Sent", this.toastSrv.iconClasses.success);
    // this.toastr.success('Hello world!', 'Toastr fun!');
    this.route.params.subscribe(params => {
      const _uid = params["id"];
      this.userSrv.getUserBasicInfo(_uid).then(res => {

        if (res["result"] === "successful") {
          this.editedUser = res["data"];
          //tags: "bizarre,love,romantic"
        } else {

        }
      }
      ).catch(error => {
        console.error(` get data error ${error}`);
      });

    })
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  sendVerifyEmail() {
    let AuthEmailRes = this.authSrv.sendAuthEmail(this.editedUser.id,
      this.editedUser.email);

    AuthEmailRes.subscribe(_res => {
      if (_res['result'] = 'successful') {
        this.toastSrv.showToast('Success', "Sent", this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('Failed', _res['message'], this.toastSrv.iconClasses.error);
      }
    }, error => {
      this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
    });

  }

  sendResetEmail() {
    let domain = window.location.origin;
    let url = '/setPassword';
    let link = domain + url;
    this.emailSrv.sendResetPasswordEmail(
      'Reset your password for FormosArt',
      this.editedUser.email,
      link).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.toastSrv.showToast('Success', "Reset Email Sent", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });
  }

}
