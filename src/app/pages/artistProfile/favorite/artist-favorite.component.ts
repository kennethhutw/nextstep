import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  LikeService,
  AuthStore,
  SettingService,
  AppSettingsService,
  TableService
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

  currentPageIndex = 1;
  numberElementPerPage = 6;
  pageMax = 1;
  pages: number[] = [];
  current5page: number[] = [0, 1, 2, 3, 4];
  artworksPageMax = 1;
  artworksPages: number[] = [];
  constructor(
    private tableSrv: TableService,
    private appSettingsSrv: AppSettingsService,
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
          if (!this.utility.IsNullOrEmpty(element['imageUrl'])) {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          } else {

            element['imageUrl'] = this.defaultProfileLogo;
          }

        });
        this.displayArtists = this.artists;
      }
    });
  }

  initArtWork() {
    this.likeSrv.getUserLikeArtWork(this.currentUser.id).subscribe(res => {

      if (res['result'] == 'successful') {
        this.artworks = res['data'];
        this.artworks.forEach((element) => {
          if (!this.utility.IsNullOrEmpty(element['imageUrl'])) {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          } else {

            element['imageUrl'] = this.settingSrv.defulatImage;
          }
          if (!this.utility.IsNullOrEmpty(element['ethValue'])) {
            let eth = parseFloat(element['ethValue']);
            element['ethValue'] = +(eth / 100).toFixed(3);
            element['usdValue'] = this.utility.getSellUSDPrice(eth);
          } else {
            element['ethValue'] = 0;
            element['usdValue'] = 0;
          }
        });

        this.artworksPageMax =
          Math.floor((this.artworks.length - 1) / this.numberElementPerPage) + 1;
        for (let p = 0; p < this.artworksPageMax; p++) {
          this.artworksPages.push(p);
        }
        this.current5page = this.InitPagenation(this.artworks);

        this.displayArtworks = this.artworks;
      }
    });
  }

  removeFavorites(liked_id) {
    this.likeSrv.removeLike(this.currentUser.id, liked_id).subscribe(res => {
      if (res['result'] == 'successful') {
        this.artworks = this.artworks.filter(artwork => {
          return artwork.id != liked_id;
        });
        this.displayArtworks = this.artworks;
        this.artists = this.artists.filter(artist => {
          return artist.id != liked_id;
        });
        this.displayArtists = this.artists;
      }
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
      console.error(`getSellArtwork error message `, error);
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
      console.error(`displayArtists error message `, error);
    } finally {

    }
  }

  onPage(i) {
    return this.tableSrv.Page(i, this.currentPageIndex, this.numberElementPerPage);
  }

  onChangePage(pageNumber: number) {
    this.currentPageIndex = pageNumber;
  }

  more(current5Page, pages) {
    if (current5Page[4] < pages.length - 1) {
      current5Page[4] = current5Page[4] + 1;
      current5Page[3] = current5Page[3] + 1;
      current5Page[2] = current5Page[2] + 1;
      current5Page[1] = current5Page[1] + 1;
      current5Page[0] = current5Page[0] + 1;
    }
  }

  less(current5Page) {
    if (current5Page[0] > 0) {
      current5Page[0] = current5Page[0] - 1;
      current5Page[1] = current5Page[1] - 1;
      current5Page[2] = current5Page[2] - 1;
      current5Page[3] = current5Page[3] - 1;
      current5Page[4] = current5Page[4] - 1;
    }

  }

  InitPagenation(data) {
    let current5Page = [];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (i % 5 === 0) {
        current5Page.push(count);
        if (count < 4) {
          count = count + 1;
        } else {
          break;
        }
      }
    }
    return current5Page;
  }

}
