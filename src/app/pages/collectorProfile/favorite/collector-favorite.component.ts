import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  LikeService,
  AuthStore,
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { environment } from '../../../../environments/environment';


@Component({
  selector: "app-collector-favorite",
  templateUrl: "./collector-favorite.component.html",
  styleUrls: ["./collector-favorite.component.css"],
})
export class CollectorFavoriteComponent implements OnInit {
  currentUser: any;
  artists = [];
  artworks = [];
  currentTab = 'editions';
  ethPrice = 0;

  constructor(
    private authStoreSrv: AuthStore,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private likeSrv: LikeService) {
    this.currentUser = this.authStoreSrv.getUserData();
    if (!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE"))) {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }
  }

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

    this.initArtist();
    this.initArtWork();
  }

  initArtist() {
    this.likeSrv.getUserLikeArtist(this.currentUser.id).subscribe(res => {

      if (res['result'] == 'successful') {
        this.artists = res['data'];
        this.artists.forEach((element) => {
          element['imageUrl'] = environment.assetUrl + element['imageUrl'];
        });
      }
    });
  }

  initArtWork() {
    this.likeSrv.getUserLikeArtWork(this.currentUser.id).subscribe(res => {
      if (res['result'] == 'successful') {
        this.artworks = res['data'];
        this.artworks.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
        });
      }
    });
  }
  removeFavorites(liked_id) {
    this.likeSrv.removeLike(this.currentUser.id, liked_id).subscribe(res => {
      this.artworks = this.artworks.filter(artwork => {
        return artwork.id != liked_id;
      });
      this.artists = this.artists.filter(artist => {
        return artist.id != liked_id;
      });
    })
  }

  getETHPrice(amount) {
    if (!this.utility.IsNullOrEmpty(amount)) {
      let usd = parseFloat(amount);
      return +(usd / this.ethPrice).toFixed(3);
    }
  }
  changeTab(tab) {
    this.currentTab = tab;
  }
}
