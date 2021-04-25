import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  LikeService,
  AuthStore,
  SettingService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { environment } from '../../../../environments/environment';

@Component({
  selector: "app-artist-favorite",
  templateUrl: "./artist-favorite.component.html",
  styleUrls: ["./artist-favorite.component.css"],
})
export class ArtistFavoriteComponent implements OnInit {
  currentUser: any;
  artists = [];
  artworks = [];
  displayArtists = [];
  displayArtworks = [];
  currentTab = 'editions';
  ethPrice = 0;
  defaultProfileLogo = null;
  searchArtworkText = "";
  searchArtistText = "";
  constructor(
    private settingSrv: SettingService,
    private authStoreSrv: AuthStore,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private likeSrv: LikeService) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
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
          if (element['imageUrl']) {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          }
          this.displayArtists = this.artists;
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

        this.displayArtworks = this.artworks;
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

  getETHPrice(usdvalue) {
    if (!this.utility.IsNullOrEmpty(usdvalue)) {
      return this.utility.getSellETHPrice(usdvalue);
    } else {
      return 0;
    }
  }
  changeTab(tab) {
    this.currentTab = tab;
  }

  onArtworkChange(deviceValue) {
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


  onArtistChange(deviceValue) {
    this.displayArtists = this.artists;

    try {
      //  this.SpinnerService.show();
      switch (deviceValue) {
        case 'LATEST':
          this.displayArtists = this.artists.sort((a, b) => b.editionDate - a.editionDate);
          break;
        case 'OLDEST':
          this.displayArtists = this.artists.sort((a, b) => a.editionDate - b.editionDate);
          break;
        case 'EXPENSIVE':
          this.displayArtists = this.artists.sort((a, b) => b.usdValue - a.usdValue);
          break;
        case 'CHEAPEST':
          this.displayArtists = this.artists.sort((a, b) => a.usdValue - b.usdValue);
          break;
        case 'POPULAR':
          this.displayArtists = this.artists.sort((a, b) => b.liked - a.liked);
          break;
      }
    } catch (error) {
      console.error(`displayArtists error message ${error}`);
    } finally {

    }
  }
}
