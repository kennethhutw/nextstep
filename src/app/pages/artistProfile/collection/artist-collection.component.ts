import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from '../../../../environments/environment';
import {
  AppSettingsService,
  ArtistService,
  AuthStore,
  EditionService,
  DataService,
  TableService
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
  searchText = "";
  displayArtworks = [];
  defaultImg = "";

  page = 1;
  numberElementPerPage = 6;
  pageMax = 1;
  pages: number[] = [];
  current5page: number[] = [0, 1, 2, 3, 4];
  artworksPageMax = 1;
  artworksPages: number[] = [];
  //partnershipPages
  constructor(
    private tableSrv: TableService,
    private dataSrv: DataService,
    private utility: Utility,
    private artistSrv: ArtistService,
    private editionSrv: EditionService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private authStoreSrv: AuthStore) {
    this.defaultImg = this.appSettingsSrv.defulatImage;
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.editionSrv.getEditionByArtistId(this.currentUser.id).subscribe(res => {

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
    }, err => {
      console.error(`getArtwrokByArtistId failed ${err}`);
    });

    this._lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(this._lang)) {
      this.translateSrv.use(this._lang);
    }
    else {
      this._lang = this.translateSrv.getBrowserLang();
      if (!this.utility.IsNullOrEmpty(this._lang)) {
        this._lang = "en";
      }
      localStorage.setItem("lang", this._lang);
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
    let _status = "Under Review";

    switch (status) {
      case "0":
        if (this._lang == "en") {
          _status = "Under Review";
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
      case "4":
        if (this._lang == "en") {
          _status = "Unavailable";
        } else if (this._lang == "zh-cn") {
          _status = "已下架";
        } else if (this._lang == "zh-tw") {
          _status = "已下架";
        }
        return _status;
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
      console.error(`getSellArtwork error message ${error}`);
    } finally {

    }
  }

  // Sort of data
  // onSort(key: string, isNumeric: boolean, objectTable: Array<any>) {
  //   this.imgIf = this.tableSrv.onTableSort(key, isNumeric, objectTable);
  // }

  // Pagination
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
