import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
  AppSettingsService
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-user-card",
  templateUrl: "./userCard.component.html",
  styleUrls: ["./userCard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class UserCardComponent {
  @Input() user;
  @Input() type;
  @Input() currentuser;

  skillOptions: any[] = [];
  strNoPosition: string = "";
  strNotFilled: string = "";

  @Output() Click: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() Collect: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() UnCollect: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() Follow: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() UnFollow: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() Chat: EventEmitter<{ user }> = new EventEmitter<{ user }>();

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
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.init_terms(_lang);
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms(lang);
      }
    });
  }

  init_terms(lang) {
    this.translateSrv.get("NONAME").subscribe((text: string) => {
      this.strNotFilled = text;
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

    this.skillOptions = this.appSettingsSrv.skillOptionsWithLang(lang);
  }


  routeToUserProfile() {
    this.Click.emit({ userId: this.user.uid });
  }

  ngOnInit() {



  }


  onClickCollect() {

    this.user.isCollect = !this.user.isCollect;
    this.Collect.emit({ userId: this.user.id });
  }

  onClickUnCollect() {

    this.user.isCollect = !this.user.isCollect;
    this.UnCollect.emit({ userId: this.user.id });
  }

  onClickChat() {
    this.Chat.emit(this.user);
  }

  onClickFollow() {

    this.user.isFollow = !this.user.isFollow;
    this.Follow.emit({ userId: this.user.id });
  }

  onClickUnFollow() {
    this.user.isFollow = !this.user.isFollow;
    this.UnFollow.emit({ userId: this.user.id });
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  convertTag(term) {

    let _term = this.skillOptions.find(option => option.value == term.toLowerCase());
    if (_term) {
      return _term.text;
    }
  }

  convertIndustryTag(term) {
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
      case "design":
        _term = "UI/UX, 設計";
        break;
      case "finance":
        _term = "金融相關";
        break;
      case "marketing":
        _term = "行銷/品牌成長";
        break;
      case "pm":
        _term = "產品管理";
        break;
      case "public":
        _term = "公共關係";
        break;
      case "sale":
        _term = "業務開發";
        break;
      case "funding":
        _term = "資金募集";
        break;
      case "law":
        _term = "法律";
        break;
      case "strategy":
        _term = "品牌營運/策略";
        break;
      case "programming":
        _term = "程式撰寫";
        break;
    }
    return _term;
  }
}
