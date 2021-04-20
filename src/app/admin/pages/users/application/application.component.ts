import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  UserService,
  AuthStore,
  ToastService,
  EmailService,
  PendingEditionService
} from '../../../../_services';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  ActivatedRoute
} from "@angular/router";
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  editedUser: any;
  editions: any = [];
  currentUser: any;
  constructor(
    private authStoreSrv: AuthStore,
    private pendingEditionSrv: PendingEditionService,
    private emailSrv: EmailService,
    private toastSrv: ToastService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
    private userSrv: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    // this.toastSrv.showToast('Success', "Sent", this.toastSrv.iconClasses.success);
    // this.toastr.success('Hello world!', 'Toastr fun!');
    this.route.params.subscribe(params => {
      const _uid = params["id"];
      this.userSrv.getUserBasicInfo(_uid).then(res => {
        console.log("res ===========", res);
        if (res["result"] === "successful") {
          this.editedUser = res["data"];
          if (!!this.editedUser) {
            this.initArtworks(this.editedUser.id);
          }
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

  CheckStatus(value) {
    console.log(" ===========", value);
    let _status = "not decide";
    switch (value) {
      case "1":
        _status = "approved";
        break;
      case 2:
        _status = "rejected";
        break;

    }
    return _status;
  }

  ngOnDestroy(): void {

  }

  initArtworks(uid) {
    try {
      this.pendingEditionSrv.getPendingEdition(uid).subscribe(res => {
        console.log(` getPendingEdition ${res}`, res);
        if (res['result'] == 'successful') {
          this.editions = res['data'];
          if (this.editions.length > 0) {
            this.editions.forEach((element) => {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            });
          }
        }
      }, error => {
        console.error(` get PendingEdition : ${error} `);

      })
    } catch (error) {

    }
  }

  // 0: not decide ,1: approve, 2:reject;
  setApprove(value) {
    try {
      this.pendingEditionSrv.updatePendingEdition(this.editedUser.id,
        this.currentUser.id, value).subscribe(_res => {
          if (_res["result"] === 'successful') {
            let _status = 'Approved';
            if (!value)
              _status = 'Rejected';
            this.toastSrv.showToast('Success', _status, this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('Failed', _res['message'], this.toastSrv.iconClasses.error);
          }
        }, error => {
          console.error(`setApprove failed `, error);
          this.toastSrv.showToast('Failed', error.message, this.toastSrv.iconClasses.error);
        });
    }
    catch (err) {
      console.error(`setApprove failed `, err);
    }
  }

  sendRejectEmail() {
    try {
      let domain = window.location.origin;
      let url = '/setPassword';
      let link = domain + url;
      this.emailSrv.sendrejectedEmail(
        'FormosArt Artist application result',
        this.editedUser.name,
        this.editedUser.email,
        link,
        this.currentUser.id).subscribe(sendRes => {
          if (sendRes['result'] == 'successful') {
            this.toastSrv.showToast('Success', "Reject Email Sent", this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
          }
          // this.msg = true;
          // this.message = 'E-mail has been sent to reset your password.';
        }, error => {
          this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
        });
    } catch (error) {

    }

  }

  sendApprovedEmail() {
    let domain = window.location.origin;
    let url = '/setPassword';
    let link = domain + url;
    this.emailSrv.sendapprovedEmail(
      this.editedUser.id,
      'FormosArt Artist Application',
      this.editedUser.name,
      this.editedUser.email,
      link,
      this.currentUser.id).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.toastSrv.showToast('Success', "Approved Email Sent", this.toastSrv.iconClasses.success);
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
