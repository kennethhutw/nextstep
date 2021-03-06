import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";
@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  SelectedLang = "en";
  constructor(
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private utility: Utility
  ) {
    let _lang = localStorage.getItem("lang");

    if (!this.utility.IsNullOrEmpty(_lang)) {

      this.translateSrv.use(_lang);
      this.SelectedLang = _lang;
    } else {
      this.translateSrv.use(this.SelectedLang);
      localStorage.setItem("lang", "zh-tw")
    }
    // } else {
    //   let _browserLang = this.translateSrv.getBrowserLang();
    //   this.translateSrv.use(_browserLang);
    //   this.SelectedLang = _browserLang;
    // }
  }

  ngOnInit() { }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
    this.dataSrv.setLang(lang);
    localStorage.setItem("lang", lang);
  }
}
