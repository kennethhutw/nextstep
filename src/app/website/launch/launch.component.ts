import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "../../_services";
import { Utility } from "../../_helpers";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-launch",
  templateUrl: "./launch.component.html",
  styleUrls: [
    "./launch.component.css",
  ]
})
export class LaunchComponent implements OnInit {

  socket;
  total = 100;
  count = 100;
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
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
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    try {


    } catch (error) {
      console.log("rrr ", error);
    }
  }
}
