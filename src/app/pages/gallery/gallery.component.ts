import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AppSettingsService,
  EditionService,
  AuthStore,
  ArtWorkService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

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
  constructor(
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
    this.SpinnerService.show();
    this.artworkSrv.getSellArtwork().subscribe(res => {

      if (res["result"] == "successful") {
        this.editions = res["data"];
        this.editions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          element.ethPrice = this.utility.getSellETHPrice(element.usdValue);
        });
        this.displayEditions = this.editions;
      }
    }, error => {
      console.error(`getSellArtwork error message ${error}`);
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
      console.error(`getSellArtwork error message ${error}`);
    } finally {
      this.SpinnerService.hide();
    }
  }
}
