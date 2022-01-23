import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, AuthStore, UserService, SettingService } from "../../_services";
import { Utility } from "../../_helpers";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-setting",
  templateUrl: "./setting-layout.component.html",
  styleUrls: [
    "./setting-layout.component.css",
  ]
})
export class SettingLayoutComponent implements OnInit {


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

  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }



  toggleSidebar() {
    this.dataSrv.toggleSidebar();
  }
}
