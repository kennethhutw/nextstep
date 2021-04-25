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
  searchText = "";
  displayArtworks = [];
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
      if (res['result'] === 'successful') {
        this.artworks = res['data'];
        this.artworks.forEach((element) => {
          element['imageUrl'] = environment.assetUrl + element['imageUrl'];
        });
        this.displayArtworks = this.artworks;
      }
      else {

      }
    }, err => {
      console.error(`getSoldArtwrokByArtistId failed ${err}`);
    });
  }


  getSellETHPrice(value) {
    return this.utility.getSellETHPrice(value);
  }
  onChange(deviceValue) {
    this.displayArtworks = this.artworks;

    try {
      //  this.SpinnerService.show();
      switch (deviceValue) {
        case 'LATEST':
          this.displayArtworks = this.artworks.sort((a, b) => b.editionDate - a.editionDate);
          break;
        case 'OLDEST':
          this.displayArtworks = this.artworks.sort((a, b) => a.editionDate - b.editionDate);
          break;
        case 'EXPENSIVE':
          this.displayArtworks = this.artworks.sort((a, b) => b.usdValue - a.usdValue);
          break;
        case 'CHEAPEST':
          this.displayArtworks = this.artworks.sort((a, b) => a.usdValue - b.usdValue);
          break;
        case 'POPULAR':
          this.displayArtworks = this.artworks.sort((a, b) => b.liked - a.liked);
          break;
      }
    } catch (error) {
      console.error(`getSellArtwork error message ${error}`);
    } finally {

    }
  }
}
