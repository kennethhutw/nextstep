import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  DataService,
  AppSettingsService,
  ArtistService,
  AuthStore,
  ArtWorkService
} from "../../../_services";
import { Utility } from "../../../_helpers";
import { environment } from '../../../../environments/environment';

@Component({
  selector: "app-artist-sold",
  templateUrl: "./artist-sold.component.html",
  styleUrls: ["./artist-sold.component.css"],
})
export class ArtistSoldArtWorkComponent implements OnInit {

  currentUser: any;
  artworks = [];
  constructor(
    private artistSrv: ArtistService,
    private artworkSrv: ArtWorkService,
    private appSettingsSrv: AppSettingsService,

    private authStoreSrv: AuthStore,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService) { }

  ngOnInit() {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

    this.currentUser = this.authStoreSrv.getUserData();

    this.artworkSrv.getSoldArtwrokByArtistId(this.currentUser.id).subscribe(res => {
      console.log("getSoldArtwrokByArtistId ============= ", res);
      if (res['result'] === 'successful') {
        this.artworks = res['data'];
      }
      else {

      }
    }, err => {
      console.error(`getSoldArtwrokByArtistId failed ${err}`);
    });
  }
  getImageURL(path) {
    return environment.assetAPIUrl + path;

  }

  getSellETHPrice(value) {
    return this.utility.getSellETHPrice(value);
  }

}
