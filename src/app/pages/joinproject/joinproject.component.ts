import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  InvitationService,
  ActivityService,
  NotificationService
} from "./../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "./../../_helpers";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
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


  invitation = null;
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private authSrv: AuthStore,
    private route: ActivatedRoute,
    private invitationSrv: InvitationService,
    private router: Router,
    private dataSrv: DataService,
    private spinnerSrv: NgxSpinnerService,
    private activitySrv: ActivityService,
    private notificationSrv: NotificationService
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
      this.router.navigate(['/signin']);
    }

    this.invitationSrv.getInvitation(this.invitiationId,
      this.currentUser.id).then(res => {

        if (res["result"] == 'successful') {
          this.invitation = res["data"];
          this.projectId = this.invitation.projectId;
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

      }
    })
  }

  onAccept() {
    this.invitationSrv.updateInvitation(this.invitation.id, {
      status: "current",
      userId: this.currentUser.id,
      projectId: this.invitation.projectId,
      username: this.currentUser.name
    }).subscribe(res => {

      if (res['result'] == 'successful') {
        this.activitySrv.insert(this.currentUser.id,
          this.projectId,
          "join",
          `${this.currentUser.name} 加入${this.invitation.name}專案！`
        ).subscribe(res => {
          if (res['result'] === 'successful') { }
        });

        this.notificationSrv.infoProjectMembers(this.projectId,
          this.currentUser.id,
          `${this.currentUser.name} 加入${this.invitation.name}專案！`,
          "1",
          '0',
          '0',
          this.currentUser.id
        ).then(res => {
          if (res['result'] === 'successful') {

          }
        })

        this.router.navigate(['/dashboard/myproject']);
      }
    })
  }
}
