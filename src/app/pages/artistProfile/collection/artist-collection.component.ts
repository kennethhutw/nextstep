import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from '../../../../environments/environment';
import {
  AppSettingsService,
  ArtistService,
  AuthStore,
  EditionService,
  DataService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";

@Component({
  selector: "app-artist-collection",
  templateUrl: "./artist-collection.component.html",
  styleUrls: ["./artist-collection.component.css"],
})
export class ArtistCollectionComponent implements OnInit {

  currentUser: any;
  artworks = [];
  _lang = "en";
  constructor(
    private dataSrv: DataService,
    private utility: Utility,
    private artistSrv: ArtistService,
    private editionSrv: EditionService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private authStoreSrv: AuthStore) { }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.editionSrv.getEditionByArtistId(this.currentUser.id).subscribe(res => {
      if (res['result'] === 'successful') {
        this.artworks = res['data'];
      }
      else {

      }
    }, err => {
      console.error(`getArtwrokByArtistId failed ${err}`);
    });

    this._lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(this._lang)) {
      this.translateSrv.use(this._lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this._lang = lang;
        this.translateSrv.use(lang);
      }
    });
  }


  getImageURL(path) {
    return environment.assetAPIUrl + path;
  }

  getImageStatus(status) {
    let _status = "Review";
    switch (status) {
      case "0":
        if (this._lang == "en") {
          _status = "Review";
        } else if (this._lang == "zh-cn") {
          _status = "审核中";
        } else if (this._lang == "zh-tw") {
          _status = "審核中";
        }
        return _status;

      case "1":
        if (this._lang == "en") {
          _status = "Available";
        } else if (this._lang == "zh-cn") {
          _status = "已上架";
        } else if (this._lang == "zh-tw") {
          _status = "已上架";
        }
        return _status;


      case "2":
        if (this._lang == "en") {
          _status = "Auction";
        } else if (this._lang == "zh-cn") {
          _status = "竞价中";
        } else if (this._lang == "zh-tw") {
          _status = "競價中";
        }
        return _status;

      case "3":
        if (this._lang == "en") {
          _status = "Sold";
        } else if (this._lang == "zh-cn") {
          _status = "已卖出";
        } else if (this._lang == "zh-tw") {
          _status = "已賣出";
        }
        return _status;

    }
  }
}
