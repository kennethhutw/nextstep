import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  UserSettingService,
  ProjectService,
  UserService,
} from "../../../_services";
import {
  AuthStore
} from "../../../_services/auth.store";
import { Utility } from "../../../_helpers";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  items: any[] = [];
  mentors: any[] = [];

  idverify = {
    email: false,
    info: false,
    interactive: false
  };

  currentUser: any;

  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private projectSrv: ProjectService,
    private authStore: AuthStore,
    private userSrv: UserService,
    private router: Router,
    private spinnerSrv: NgxSpinnerService
  ) {


  }


  ngOnInit() {
    this.spinnerSrv.show();
    // let _lang = localStorage.getItem("lang");
    // if (!this.utility.IsNullOrEmpty(_lang)) {
    //   this.translateSrv.use(_lang);
    //   this.initTags(_lang);
    // } else {
    //   let _browserLang = this.translateSrv.getBrowserLang();
    //   this.translateSrv.use(_browserLang);
    //   this.initTags(_browserLang);
    // }
    // this.dataSrv.langKey.subscribe((lang) => {
    //   if (!this.utility.IsNullOrEmpty(lang)) {
    //     this.translateSrv.use(lang);
    //     this.initTags(lang);
    //   }
    // });
    // this.userSettingSrv.getByUserId(this.currentUser.id).then(res => {
    //   if (res['result'] == 'successful') {
    //     let _setting = res['data'];
    //     if (_setting.email) {
    //       this.idverify.email = true;
    //     }
    //     if (_setting.info) {
    //       this.idverify.info = true;
    //     }
    //     if (_setting.interactive) {
    //       this.idverify.interactive = true;
    //     }

    //   }
    // }).catch(error => {
    //   console.error("cannot get setting.", error);
    // }).then(() => {
    //   this.spinnerSrv.hide();

    // })

    this.currentUser = this.authStore.getUserData();
    let _id = null;
    if (this.currentUser && this.currentUser.id) {
      _id = this.currentUser.id;
    }

    this.userSrv.verifiedStatus(_id).then(res => {

      if (res['result'] == 'successful') {

        this.idverify = {
          email: res['email'],
          info: res['isCompleted'],
          interactive: res['isFollowEachOther']
        }
      }
    })
    this.projectSrv.getMayInterestedProjects(_id).then(res => {

      if (res['result'] == 'successful') {
        this.items = res['data'];
      }
      this.spinnerSrv.hide();
    }).catch(error => {
      console.error("error", error);
      this.spinnerSrv.hide();
    })

    this.userSrv.getMayInterestedPublicMentors(_id).then(res => {
      if (res['result'] == 'successful') {
        this.mentors = res['data'];
        if (this.mentors && this.mentors.length > 0) {
          this.mentors.forEach(element => {
            if (!this.utility.IsNullOrEmpty(element.tags)) {
              element.tags = element.tags.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
          });
        }

      }
      this.spinnerSrv.hide();
    }).catch(error => {
      console.error("error", error);
      this.spinnerSrv.hide();
    })
  }





}
