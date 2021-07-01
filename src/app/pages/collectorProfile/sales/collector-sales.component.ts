import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  DataService,
  AppSettingsService,
  TableService,
  ArtWorkService,
  AuthStore,
  EditionService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { environment } from '../../../../environments/environment';


@Component({
  selector: "app-collector-sales",
  templateUrl: "./collector-sales.component.html",
  styleUrls: ["./collector-sales.component.css"],
})
export class CollectorSalesComponent implements OnInit {
  currentUser: any;
  artworks = [];
  displayArtworks = [];
  ethPrice = 0;
  searchText = "";

  page = 1;
  numberElementPerPage = 6;
  pageMax = 1;
  pages: number[] = [];
  current5page: number[] = [0, 1, 2, 3, 4];
  artworksPageMax = 1;
  artworksPages: number[] = [];
  constructor(
    private tableSrv: TableService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private editionSrv: EditionService,
    private dataSrv: DataService,
    private artworkSrv: ArtWorkService,
    private authStoreSrv: AuthStore) { }

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
    this.artworkSrv.getSellCollectorArtwork(this.currentUser.id).subscribe(res => {

      if (res['result'] === 'successful') {
        if (res['data'] != null) {
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
      }
      else {
        this.artworks = [];
      }
    }, error => {
      console.error(`getArtwrokByArtistId failed `, error);
    });
  }

  getETHPrice(amount) {
    if (!this.utility.IsNullOrEmpty(amount)) {
      let usd = parseFloat(amount);
      let ethPrice = Number(localStorage.getItem("ETHPRICE"));
      //   const ethAmount = +(usd / ethPrice).toFixed(3);
      return +(usd / ethPrice).toFixed(3);
    }
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
    return this.tableSrv.Page(i, this.page, this.numberElementPerPage);
  }

  onChangePage(pageNumber: number) {
    this.page = pageNumber;
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
