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


  @Output() Click: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() Collect: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() UnCollect: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() Follow: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() UnFollow: EventEmitter<{ userId: any }> = new EventEmitter<{ userId: any }>();
  @Output() Chat: EventEmitter<{ user }> = new EventEmitter<{ user }>();
  constructor(
    private utility: Utility,
    private router: Router,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService
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


  routeToUserProfile() {
    this.Click.emit({ userId: this.user.uid });
  }

  ngOnInit() {
    this.skillOptions = this.appSettingsSrv.skillOptions();
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

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
    // let _term = "";
    // switch (term.toLowerCase()) {
    //   case "ecomm":
    //     _term = "電子商務";
    //     break;
    //   case "medical":
    //     _term = "醫學科技";
    //     break;
    //   case "ai":
    //     _term = "人工智慧";
    //     break;
    //   case "transport":
    //     _term = "運輸服務";
    //     break;
    //   case "edutech":
    //     _term = "教育技術";
    //     break;
    //   case "fintech":
    //     _term = "金融科技";
    //     break;
    //   case "sharingeconomy":
    //     _term = "共享經濟";
    //     break;
    //   case "game":
    //     _term = "遊戲產業";
    //     break;
    //   case "design":
    //     _term = "UI/UX, 設計";
    //     break;
    //   case "finance":
    //     _term = "金融相關";
    //     break;
    //   case "marketing":
    //     _term = "行銷/品牌成長";
    //     break;
    //   case "pm":
    //     _term = "產品管理";
    //     break;
    //   case "public":
    //     _term = "公共關係";
    //     break;
    //   case "sale":
    //     _term = "業務開發";
    //     break;
    //   case "funding":
    //     _term = "資金募集";
    //     break;
    //   case "law":
    //     _term = "法律";
    //     break;
    //   case "strategy":
    //     _term = "品牌營運/策略";
    //     break;
    //   case "programming":
    //     _term = "程式撰寫";
    //     break;
    // }
    // return _term;
    let _term = this.skillOptions.find(option => option.value == term.toLowerCase());
    if (_term) {
      return _term.text;
    }
  }

  convertIndustryTag(term) {
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
