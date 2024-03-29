import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  UserService,
  ToastService,
  EmailService
} from '../../../../_services';
import {
  AuthStore
} from "../../../../_services/auth.store";
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
  styleUrls: ['./usersetting.component.scss']
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

    this.route.params.subscribe(params => {
      const _uid = params["id"];
      this.userSrv.getUserBasicInfo(_uid).then(res => {

        if (res["result"] === "successful") {
          this.editedUser = res["data"];
        } else {

        }
      }
      ).catch(error => {
        console.error(` get data error`, error);
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
        this.toastSrv.showToast('', "Sent", this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('', _res['message'], this.toastSrv.iconClasses.error);
      }
    }, error => {
      console.error(` AuthEmailRes error`, error);
      this.toastSrv.showToast('', error, this.toastSrv.iconClasses.error);
    });

  }

  sendResetEmail() {
    let domain = window.location.origin;
    let url = '/resetPassword';
    let link = domain + url;
    this.emailSrv.sendResetPasswordEmail(
      'Reset your password for NextStep',
      this.editedUser.email,
      link).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.toastSrv.showToast('', "Reset Email Sent", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('', sendRes['message'], this.toastSrv.iconClasses.error);
        }

      }, error => {
        console.error(` sendResetEmail error`, error);
        this.toastSrv.showToast('', error, this.toastSrv.iconClasses.error);
      });
  }

}
