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
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
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
  values = "";
  tags = [];
  IsShowTags = false;
  defaultProfileLogo = null;
  filterValue = null;
  searchText = '';
  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {
    this.SpinnerService.show();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.initTags(_lang);
    } else {
      let _browserLang = this.translateSrv.getBrowserLang();
      this.translateSrv.use(_browserLang);
      this.initTags(_browserLang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.initTags(lang);
      }
    });

    this.SpinnerService.hide();
    this.displayItems = this.items;
  }

  splitArr(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  initTags(lang) {

    this.appSettingsSrv.getTagOptions(lang).subscribe((data) => {
      this.tags = data;
    });
  }

  onKey(event: any) {
    // without type info
    let key = event.target.value.toLowerCase();
    let result = this.items.filter((value) => {
      return value.name.toLowerCase().indexOf(key) != -1 ? value : null;
    });
    this.displayItems = this.splitArr(result, 3);
  }

  IsShowAllTags() {
    this.IsShowTags = !this.IsShowTags;
  }

  onfilter(value) {


  }

  onClearFilter() {
    this.filterValue = null;
    this.displayItems = this.splitArr(this.items, 3);
  }


}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
