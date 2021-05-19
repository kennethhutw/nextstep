import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, PromoService } from "../../_services";
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


  total = 100;
  count = 100;
  isLaunch = false;
  email = "";
  code = "";
  IsGoToRegister = false;
  timeLeft: number = 60;
  interval: any;
  constructor(
    private promoSrv: PromoService,
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
    this.GetCount();
  }


  callback() {
    this.isLaunch = true;
  }

  GetCode() {
    this.promoSrv.getPromo(this.email, "1").subscribe(res => {

      if (res["result"] == "successful") {
        this.code = res["data"];
        this.IsGoToRegister = true;
        this.count = res["count"];
      }
    })
  }

  GetCount() {
    this.promoSrv.getCount().subscribe(res => {
      console.log("============", res);
      if (res["result"] == "successful") {
        this.count = res["data"];
      }
    })
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.isLaunch)
        this.GetCount();
    }, 1000)
  }
}
