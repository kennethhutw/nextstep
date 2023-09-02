import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import { DataService } from "../../_services";
@Component({
  selector: "app-person",
  templateUrl: "./person.component.html",
  styleUrls: ["./person.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PersonCardComponent implements OnInit {
  @Input() name: string;
  @Input() position: string;
  @Input() imageUrl: string;
  @Input() tags;
  @Input() uid: string;
  @Input() user;
  @Input() type;

  strNoName: string;
  strNoPosition: string;
  terms = {
    strECOMM: "",
    strAI: "",
    strMEDICAL: "",
    strTRANSPORT: "",
    strEDUTECH: "",
    strFINTECH: "",
    strSHARINGECONOMY: "",
    strGAME: "",
    strPLATFORM: "",
  }

  constructor(
    private utility: Utility,
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private router: Router
  ) {
    this.init_terms();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.init_terms();
    }
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  init_terms() {
    this.translateSrv.get("NONAME").subscribe((text: string) => {
      this.strNoName = text;
    });

    this.translateSrv.get("NOPOISTION").subscribe((text: string) => {
      this.strNoPosition = text;
    });

    this.translateSrv.get([
      "ECOMM",
      "AI",
      "MEDICAL",
      "TRANSPORT",
      "EDUTECH",
      "FINTECH",
      "SHARINGECONOMY",
      "GAME",
      "PLATFORM",

    ]).subscribe((words: string) => {

      this.terms.strECOMM = words["ECOMM"];
      this.terms.strAI = words["AI"];
      this.terms.strMEDICAL = words["MEDICAL"];
      this.terms.strTRANSPORT = words["TRANSPORT"];
      this.terms.strEDUTECH = words["EDUTECH"];
      this.terms.strFINTECH = words["FINTECH"];
      this.terms.strSHARINGECONOMY = words["SHARINGECONOMY"];
      this.terms.strGAME = words["GAME"];
      this.terms.strPLATFORM = words["PLATFORM"];

    });
  }
  routeToUserProfile() {
    if (this.type && this.type == "mentor") {
      this.router.navigate(["./mentor/" + this.uid], {});
    } else {
      this.router.navigate(["./u/" + this.uid], {});
    }

  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  convertTag(term) {

    let _term = "";
    switch (term.toLowerCase()) {
      case "ecomm":
        _term = this.terms.strECOMM;
        break;
      case "medical":
        _term = this.terms.strMEDICAL;
        break;
      case "ai":
        _term = this.terms.strAI;
        break;
      case "transport":
        _term = this.terms.strTRANSPORT;
        break;
      case "edutech":
        _term = this.terms.strEDUTECH;
        break;
      case "fintech":
        _term = this.terms.strFINTECH;
        break;
      case "sharingeconomy":
        _term = this.terms.strSHARINGECONOMY;
        break;
      case "game":
        _term = this.terms.strGAME;
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
      case "hr":
        _term = "人力資源";
        break;
      case "uiux":
      case "design":
        _term = "產品/設計";
        break;
      case "product":
      case "pm":
        _term = "產品/設計";
        break;
    }
    return _term;
  }
}
