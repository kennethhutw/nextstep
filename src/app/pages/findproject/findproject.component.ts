import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {

  DataService,
  AppSettingsService,
  SettingService
} from "../../_services";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-findproject",
  templateUrl: "./findproject.component.html",
  styleUrls: ["./findproject.component.css"]
})
export class FindProjectComponent implements OnInit {
  items = [{
    id: 1,
    name: "Next",
    description: "找尋side project, 找尋team member, 建立side project, 找尋side project意見",
    type: "Startup",
    tags: [
      "找夥伴",
      "募資中"
    ]
  }, {
    id: 2,
    name: "Karma",
    description: "WFH sorted: praise, rewards, surveys and watercooler chats",
    type: "Startup",
    tags: [
      "找Co-founder"
    ]
  }, {
    id: 3,
    name: "Early Bird",
    description: "If Appsumo and Product Hunt had a baby.",
    type: "Startup",
    tags: [
      "找夥伴",
      "找Co-founder"
    ]
  }, {
    id: 4,
    name: "Ragg",
    description: "Cleaning platform app",
    type: "Startup",
    tags: [
      "募資中"
    ]
  }];
  displayItems = [];
  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.SpinnerService.show();
    // let _lang = localStorage.getItem("lang");
    // if (!this.utility.IsNullOrEmpty(_lang)) {
    //   this.translateSrv.use(_lang);

    // } else {
    //   let _browserLang = this.translateSrv.getBrowserLang();
    //   this.translateSrv.use(_browserLang);

    // }
    // this.dataSrv.langKey.subscribe((lang) => {
    //   if (!this.utility.IsNullOrEmpty(lang)) {
    //     this.translateSrv.use(lang);

    //   }
    // });
    this.translateSrv.use("zh-tw");
    this.displayItems = this.items;
    this.SpinnerService.hide();
  }

  splitArr(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }



  onKey(event: any) {
    // without type info

  }


  onfilter(value) {


  }

  onClearFilter() {

  }

}
