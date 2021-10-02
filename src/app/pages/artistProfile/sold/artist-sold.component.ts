import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  DataService,
  AppSettingsService,
  ArtistService,
  AuthStore,
  ArtWorkService,
  TableService
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


  currentPageIndex = 1;
  numberElementPerPage = 6;
  pageMax = 1;
  pages: number[] = [];
  current5page: number[] = [0, 1, 2, 3, 4];
  artworksPageMax = 1;
  artworksPages: number[] = [];
  constructor(
    private artistSrv: ArtistService,
    private artworkSrv: ArtWorkService,
    private appSettingsSrv: AppSettingsService,
    private tableSrv: TableService,
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
        this.artworksPageMax =
          Math.floor((this.artworks.length - 1) / this.numberElementPerPage) + 1;
        for (let p = 0; p < this.artworksPageMax; p++) {
          this.artworksPages.push(p);
        }
        this.current5page = this.InitPagenation(this.artworks);

        this.displayArtworks = this.artworks;

      }
      else {

      }
    }, error => {
      console.error(`getSoldArtwrokByArtistId failed `, error);
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
      console.error(`getSellArtwork error message `, error);
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
