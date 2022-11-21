import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import { DataService } from "../../_services";
@Component({
  selector: "app-member-card",
  templateUrl: "./memberCard.component.html",
  styleUrls: ["./memberCard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MemberCardComponent implements OnInit {
  @Input() name: string;
  @Input() position: string;
  @Input() imageUrl: string;
  @Input() tags;
  @Input() uid: string;
  @Input() user;

  constructor(
    private utility: Utility,
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private router: Router
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

  routeToUserProfile() {
    this.router.navigate(["./u/" + this.uid], {});
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  convertTag(term) {

    let _term = "";
    switch (term.toLowerCase()) {
      case "ecomm":
        _term = "電子商務";
        break;
      case "medical":
        _term = "醫學科技";
        break;
      case "ai":
        _term = "人工智慧";
        break;
      case "transport":
        _term = "運輸服務";
        break;
      case "edutech":
        _term = "教育技術";
        break;
      case "fintech":
        _term = "金融科技";
        break;
      case "sharingeconomy":
        _term = "共享經濟";
        break;
      case "game":
        _term = "遊戲產業";
        break;
      case "bd":
        _term = "市場開發";
        break;
      case "software":
        _term = "軟體開發";
        break;
      case "it":
        _term = "系統與基礎架構";
        break;
      case "marketing":
        _term = "行銷/企劃/內容";
        break;
      case "op":
        _term = "營運";
        break;
      case "design":
        _term = "產品/設計";
        break;
      case "pm":
        _term = "產品/設計";
        break;
    }
    return _term;
  }
}
