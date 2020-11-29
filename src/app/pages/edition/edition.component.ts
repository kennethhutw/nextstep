import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";

@Component({
  selector: "edition",
  templateUrl: "./edition.component.html",
  styleUrls: ["./edition.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EditionComponent implements OnInit {
  IsFollowed = true;
  constructor(
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
    /*  this.translateSrv.setTranslation("zh-tw", {
      HELLO: "你好",
    });
    this.translateSrv.setTranslation("en", {
      HELLO: "Hello",
    }); */
  }

  ngOnInit() {
    // this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }
}
