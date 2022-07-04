import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {

  DataService,
  AppSettingsService,
  SettingService,
  UserService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-pub-profile",
  templateUrl: "./pubprofile.component.html",
  styleUrls: ["./pubprofile.component.css"]
})
export class PubProfileComponent implements OnInit {
  items = [];
  displayItems = [];
  values = "";
  tags = [];
  IsShowTags = false;
  defaultProfileLogo = null;
  filterValue = null;
  searchText = '';
  currentUser: any;
  userProfile = null;
  constructor(
    private UserSrv: UserService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
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
    this.currentUser = this.authSrv.getUserData();
    console.log("==================", this.currentUser);
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
    if (this.utility.IsNullOrEmpty(this.currentUser.imageUrl)) {
      this.currentUser.imageUrl = this.defaultProfileLogo;
    } else {
      this.currentUser.imageUrl = environment.assetUrl + this.currentUser.imageUrl;
    }
    let userId = this.route.snapshot.paramMap.get('userId');
    console.log("userId ==================", userId);
    this.UserSrv.getUserInfo(userId).then(res => {
      console.log("userProfile ==================", res);
      if (res['result'] == 'successful') {
        this.userProfile = res['data'];
        if (this.userProfile.skills != null) {
          this.userProfile.skills = this.userProfile.skills.split(",");
        }
      }
    })
    this.route.queryParams.subscribe((params) => {
      console.log(" ==================", params);
      if (params['userId']) {
        this.UserSrv.getUserInfo(params['userId']).then(res => {
          console.log(" ==================", res);
          if (res['result'] == 'successful') {

          }
        })
      }
    });
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

  onCoverImgError(event) {
    event.target.src = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
  }

  onImgError(event) {
    event.target.src = "./../../../assets/icons/profile.png";
  }

  IsNullorEmpty(value) {
    return !this.utility.IsNullOrEmpty(value)
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
