import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  UserService,
  AuthStore,
  ToastService
} from '../../../../_services';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  ActivatedRoute
} from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usersetting',
  templateUrl: './usersetting.component.html',
  styleUrls: ['./usersetting.component.css']
})
export class UserSettingComponent implements OnInit {

  editedUser: any;
  constructor(
    private toastr: ToastrService,
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

  }

}
