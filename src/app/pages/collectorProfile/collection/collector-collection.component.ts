import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AppSettingsService,
  ArtistService,
  ArtWorkService,
  AuthStore,
  EditionService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { environment } from '../../../../environments/environment';


@Component({
  selector: "app-collector-collection",
  templateUrl: "./collector-collection.component.html",
  styleUrls: ["./collector-collection.component.css"],
})
export class CollectorCollectionComponent implements OnInit {
  currentUser: any;
  artworks = [];
  displayArtworks = [];
  ethPrice = 0;
  searchText = "";
  constructor(private translateSrv: TranslateService,
    private utility: Utility,
    private editionSrv: EditionService,
    private dataSrv: DataService,
    private artworkSrv: ArtWorkService,
    private authStoreSrv: AuthStore) {
    this.artworks = [];
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

    this.artworkSrv.getArtworkByCollector(this.currentUser.id).subscribe(res => {
      if (res['result'] === 'successful') {
        if (res['data'] != null) {
          this.artworks = res['data'];
          this.artworks.forEach((element) => {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          });
          this.displayArtworks = this.artworks;
        }
      }
      else {
        this.artworks = [];
      }
    }, error => {
      console.error(`getArtwrokByArtistId failed`, error);
    });
  }


  getImageURL(path) {
    return environment.assetAPIUrl + path;
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
      console.error(`getSellArtwork error message `, error);
    } finally {

    }
  }

  getETHPrice(amount) {
    if (!this.utility.IsNullOrEmpty(amount)) {
      let usd = parseFloat(amount);
      let ethPrice = Number(localStorage.getItem("ETHPRICE"));
      //   const ethAmount = +(usd / ethPrice).toFixed(3);
      return +(usd / ethPrice).toFixed(3);
    }
  }
}
