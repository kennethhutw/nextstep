import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { Utility } from "./../../../_helpers";
import { Web3Service, DataService } from "../../../_services";

@Component({
  selector: "app-register-buyer",
  templateUrl: "./register-buyer.component.html",
  styleUrls: ["./register-buyer.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterBuyerComponent implements OnInit {
  popularEditions = [];
  recentEditions = [];
  wellatAddress = "";
  IsAgree = false;

  constructor(
    private web3Srv: Web3Service,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {
    let _lang = localStorage.getItem("lang");
    if (this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {}

  WellectConnect() {
    if (this.web3Srv.ethEnabled()) {
      this.web3Srv.getAccountDetail().then(
        (data) => {
          console.log("User", data);
          if (data.address) this.wellatAddress = data.address;
        },
        (error) => {
          console.log("getAccountDetail error", error);
        }
      );
    } else {
      console.warn("Metamask not found Install or enable Metamask");
    }
  }
}
