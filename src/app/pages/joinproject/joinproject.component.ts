import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, InvitationService } from "./../../_services";
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
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authSrv.getUserData();
    if (!this.currentUser) {
      this.spinnerSrv.hide();
      this.router.navigate(['/login']);
    }

    this.invitationSrv.getInvitation(this.projectId, this.currentUser.id).then(res => {
      console.log("res ============", res);
      if (res["result"] == 'successful') {
        this.invitation = res["data"];
      }
    }).then(() => {
      this.spinnerSrv.hide();
    })

  }

  onReject() {
    this.invitationSrv.updateInvitation(this.invitation.id, {
      status: "2"
    }).subscribe(res => {
      console.log("onReject res =========", res);
      if (res['result'] == 'successful') {

      }
    })
  }

  onAccept() {
    this.invitationSrv.updateInvitation(this.invitation.id, {
      status: "1"
    }).subscribe(res => {
      console.log("onAccept res =========", res);
      if (res['result'] == 'successful') {

      }
    })
  }
}
