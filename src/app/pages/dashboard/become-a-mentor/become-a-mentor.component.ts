import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  SettingService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { AuthStore } from "src/app/_services/auth.store";
import * as moment from 'moment';


@Component({
  selector: "app-become-a-mentor",
  templateUrl: "./become-a-mentor.component.html",
  styleUrls: ["./become-a-mentor.component.scss"]
})
export class BeAmentorComponent implements OnInit {

  currentUser;
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv: AuthStore,
    public settingSrv: SettingService
  ) {

    this.currentUser = this.authStoreSrv.getUserData();
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



}
