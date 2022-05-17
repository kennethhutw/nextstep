import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  UserService,
  SettingService,
  ProjectService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-setting",
  templateUrl: "./setting-layout.component.html",
  styleUrls: [
    "./setting-layout.component.scss",
  ]
})
export class SettingLayoutComponent implements OnInit {

  currentUser: any;
  projects: any;

  expand: boolean = false;
  constructor(
    private settingSrv: SettingService,
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv: AuthStore,
    private projectSrv: ProjectService
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
    this.translateSrv.use("zh-tw");
    this.currentUser = this.authStoreSrv.getUserData();
    this.projectSrv.getProjectsByUid(
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        this.projects = res['data'];

      }
    }).catch(error => {
      console.error("error", error);
    })
  }



  toggleSidebar() {
    this.dataSrv.toggleSidebar();
  }

  ddToggle() {
    this.expand = !this.expand;
  }
}
