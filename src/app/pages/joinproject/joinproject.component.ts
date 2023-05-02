import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  InvitationService
} from "./../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "./../../_helpers";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, timer, } from 'rxjs';

import { map, take } from 'rxjs/operators';
@Component({
  selector: "app-joinproject",
  templateUrl: "./joinproject.component.html",
  styleUrls: [
    "./joinproject.component.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class JoinProjectComponent implements OnInit {

  projectId: string = "";
  invitiationId: string = "";
  currentUser;

  countDownValue: number = 0;
  public timerSub: Subscription;
  public value: number = 0;


  invitation = null;
  switch_expression: number = -1;
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private authSrv: AuthStore,
    private route: ActivatedRoute,
    private invitationSrv: InvitationService,
    private router: Router,
    private dataSrv: DataService,
    private spinnerSrv: NgxSpinnerService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }

  ngOnInit() {
    this.spinnerSrv.show();
    this.invitiationId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authSrv.getUserData();
    if (!this.currentUser) {
      this.spinnerSrv.hide();
      this.router.navigate(['/signin'], { queryParams: { 'redirectURL': this.router.url } });
    }

    this.invitationSrv.getInvitation(this.invitiationId,
      this.currentUser.id).then(res => {

        if (res["result"] == 'successful') {
          this.invitation = res["data"];
          this.projectId = this.invitation.projectId;
          this.switch_expression = 2;
        } else {
          this.switch_expression = 1;
        }
      }).then(() => {
        this.spinnerSrv.hide();
      })

  }

  onReject() {
    this.invitationSrv.updateInvitation(this.invitation.id, {
      status: "rejected"
    }).subscribe(res => {
      if (res['result'] == 'successful') {
        this.switch_expression = 4;
        this.startTimer();
      }
    })
  }

  onAccept() {
    this.invitationSrv.acceptJoinInvitation(this.invitation.id, {
      status: "current",
      userId: this.currentUser.id,
      projectId: this.invitation.projectId,
      username: this.currentUser.name
    }).subscribe(res => {

      if (res['result'] == 'successful') {
        this.switch_expression = 3;
        this.startTimer();
      } else {
        this.switch_expression = 1;
      }
    }, error => {
      console.log(error);
    })
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
        this.GoProjectPage()
      }
    );
  }
  GoProjectPage() {
    this.router.navigate(['/dashboard/myproject']);
  }

  GoHomePage() {
    this.router.navigate(['/index']);
  }
}
