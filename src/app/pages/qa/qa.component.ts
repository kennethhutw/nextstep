import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";
@Component({
  selector: "app-qa",
  templateUrl: "./qa.component.html",
  styleUrls: ["./qa.component.scss"]
})
export class QAComponent implements OnInit {
  constructor(private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService) {

  }

  ngOnInit() {
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

}
