import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, UserService, SettingService } from "../../_services";
import { Utility } from "../../_helpers";
import { Router, NavigationEnd } from "@angular/router";
import { environment } from '../../../environments/environment';
import {
  AuthStore
} from "../../_services/auth.store";
@Component({
  selector: "app-project-layout",
  templateUrl: "./project-layout.component.html",
  styleUrls: [
    "./project-layout.component.scss",
  ]
})
export class ProjectLayoutComponent implements OnInit {

  project = {
    id: '1'
  };

  currentMenu = 'profile';
  constructor(
    private settingSrv: SettingService,
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv: AuthStore,
    private userSrv: UserService
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
    this.router.events.subscribe((val) => {
      // see also
      if (val) {
        let _lastIndex = this.router.url.lastIndexOf("/");
        this.currentMenu = this.router.url.substring(_lastIndex + 1);

      }
    })
  }

  ngOnInit() {
    let _lastIndex = this.router.url.lastIndexOf("/");
    this.currentMenu = this.router.url.substring(_lastIndex + 1);

  }



  toggleSidebar() {
    this.dataSrv.toggleSidebar();
  }
}
