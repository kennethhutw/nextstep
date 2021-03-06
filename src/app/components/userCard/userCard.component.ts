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

  @Output() onCollect: EventEmitter<{
    id: any,
    isCollect: any,
    type: string
  }> = new EventEmitter<{
    id: any,
    isCollect: any,
    type: string
  }>();
  constructor(
    private utility: Utility,
    private router: Router,
    private dataSrv: DataService,
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
    this.router.navigate(["./u/" + this.user.uid], {});
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }

  onClickCollect() {

    this.user.isCollect = !this.user.isCollect;
    this.onCollect.emit({ id: this.user.id, isCollect: this.user.isCollect, type: this.type });
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
