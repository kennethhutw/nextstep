import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ArtistService,
  DataService,
  AppSettingsService,
  SettingService
} from "../../_services";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-find-mentor",
  templateUrl: "./findmentor.component.html",
  styleUrls: ["./findmentor.component.css"]
})
export class FindMentorComponent implements OnInit {
  items = [{
    name: "Kenneth",
    position: "Software developer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar2.png",
    isFavortie: false,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "full-stack",
      "blockchain"
    ]

  },
  {
    name: "Anne",
    position: "UI/UX designer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar3.png",
    isFavortie: true,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "UI/UX",
      "Front-end"
    ]
  },
  {
    name: "Ken",
    position: "DevOps developer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar4.png",
    isFavortie: false,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "DevOps ",
      "IT"
    ]
  }];
  displayItems = [];
  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private artistSrv: ArtistService,
    private SpinnerService: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.SpinnerService.show();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);

    } else {
      let _browserLang = this.translateSrv.getBrowserLang();
      this.translateSrv.use(_browserLang);

    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);

      }
    });
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

  }


  onfilter(value) {


  }

  onClearFilter() {

  }

  onChange(deviceValue) {

  }
}
