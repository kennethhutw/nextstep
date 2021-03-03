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
  ethPrice = 0;
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
        }
      }
      else {
        this.artworks = [];
      }
    }, err => {
      console.error(`getArtwrokByArtistId failed ${err}`);
    });
  }


  getImageURL(path) {
    return environment.assetAPIUrl + path;
  }

  getImageStatus(status) {
    switch (status) {
      case "0":
        return "審核中";

      case "1":
        return "上架中";

      case "2":
        return "已上架";

      case "3":
        return "競價中";

      case "4":
        return "已下架";

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
