import {
  Component, Output, Input,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "ui-recruit-card",
  templateUrl: "./recruitCard.component.html",
  styleUrls: ["./recruitCard.component.scss"]
})
export class RecruitCardComponent {
  @Input() job;
  @Input() user;

  @Output() onCollect: EventEmitter<{ projectId: any, isCollect: any }> = new EventEmitter<{ projectId: any, isCollect: any }>();
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
    this.router.navigate(["./job/" + this.job.id], {});
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }

  convertTag(term) {
    console.log("recruit =========", term)
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
//https://www.bootdey.com/snippets/view/Assign-Project-List#html
