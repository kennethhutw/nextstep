import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, AuthStore, UserService, SettingService } from "../../_services";
import { Utility } from "../../_helpers";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-project-layout",
  templateUrl: "./project-layout.component.html",
  styleUrls: [
    "./project-layout.component.css",
  ]
})
export class ProjectLayoutComponent implements OnInit {

  project = {
    id: '1'
  };
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

  }



  toggleSidebar() {
    this.dataSrv.toggleSidebar();
  }
}
