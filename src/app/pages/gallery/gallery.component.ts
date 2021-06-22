import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AppSettingsService,
  EditionService,
  AuthStore,
  ArtWorkService,
  SeoService,
  ScrollService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.css"],
})
export class GalleryComponent implements OnInit {
  editions = [];
  displayEditions = [];
  tags = [];
  IsShowTags = false;
  filterValue = null;
  searchText = '';
  selectOption = 'LATEST';
  currentUser: any;
  private ngUnsubscribe = new Subject();
  itemCount = 6;

  constructor(
    private scrollService: ScrollService,
    private SeoSrv: SeoService,
    private authStoreSrv: AuthStore,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private artworkSrv: ArtWorkService,
    private SpinnerService: NgxSpinnerService
  ) {

    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.initTags(_lang);
    } else {
      this.initTags("en");
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.initTags(lang);
      }
    });

  }

  initTags(lang) {
    this.appSettingsSrv.getTagOptions(lang).subscribe((data) => {
      this.tags = data;
    });
  }

  IsShowAllTags() {
    this.IsShowTags = !this.IsShowTags;
  }

  ngOnInit() {
    this.scrollService.onScrolledDown$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.fetchMoreItems());

    this.SeoSrv.updateTitle('Gallery');
    this.SpinnerService.show();
    this.currentUser = this.authStoreSrv.getUserData();
    this.artworkSrv.getSellArtwork().subscribe(res => {

      if (res["result"] == "successful") {
        this.editions = res["data"];
        this.editions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          if (!this.utility.IsNullOrEmpty(element['ethValue'])) {
            let eth = parseFloat(element['ethValue']);
            element['ethValue'] = +(eth / 100).toFixed(3);
            element['usdValue'] = this.utility.getSellUSDPrice(eth);
          } else {
            element['ethValue'] = 0;
            element['usdValue'] = 0;
          }
        });
        this.displayEditions = this.editions;

      }
    }, error => {
      console.error(`getSellArtwork error message `, error);
    }, () => {
      this.SpinnerService.hide();
    });
  }

  onfilter(value) {

    let result = this.editions.filter((edition) => {
      if (edition.tags !== null)
        return edition.tags.toLowerCase().indexOf(value) != -1 ? value : null;
    });
    this.displayEditions = result;
    this.filterValue = value;
  }

  onClearFilter() {
    this.filterValue = null;
    this.displayEditions = this.editions;
  }

  onChange(deviceValue) {
    this.displayEditions = this.editions;
    try {
      this.SpinnerService.show();
      switch (deviceValue) {
        case 'LATEST':
          this.displayEditions = this.editions.sort((a, b) => b.editionDate - a.editionDate);
          break;
        case 'OLDEST':
          this.displayEditions = this.editions.sort((a, b) => a.editionDate - b.editionDate);
          break;
        case 'EXPENSIVE':
          this.displayEditions = this.editions.sort((a, b) => b.usdValue - a.usdValue);
          break;
        case 'CHEAPEST':
          this.displayEditions = this.editions.sort((a, b) => a.usdValue - b.usdValue);
          break;
        case 'POPULAR':
          this.displayEditions = this.editions.sort((a, b) => b.liked - a.liked);
          break;
      }
    } catch (error) {
      console.error(`getSellArtwork error message `, error);
    } finally {
      this.SpinnerService.hide();
    }
  }

  private fetchMoreItems() {
    // add more items
    this.itemCount += 6;
  }

  checkDisplayAmount(i) {
    if (i < this.itemCount) {
      return true;
    }
    else {
      return false;
    }
  }
}
