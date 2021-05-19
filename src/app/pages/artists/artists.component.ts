import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ArtistService,
  DataService,
  AppSettingsService,
  SettingService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.css"]
})
export class ArtistsComponent implements OnInit {
  artists = [];
  displayArtists = [];
  values = "";
  tags = [];
  IsShowTags = false;
  defaultProfileLogo = null;
  filterValue = null;
  searchText = '';
  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private artistSrv: ArtistService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {
    this.SpinnerService.show();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.initTags(_lang);
    } else {
      let _browserLang = this.translateSrv.getBrowserLang();
      this.translateSrv.use(_browserLang);
      this.initTags(_browserLang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.initTags(lang);
      }
    });

    // this.artistSrv.getAllArtists().subscribe((data) => {
    //   this.artists = data;
    //   this.displayArtists = this.splitArr(data, 3);
    // });

    this.artistSrv.getArtists().subscribe(res => {
      if (res["result"] === "successful") {
        this.artists = res["data"];
        this.artists.forEach((element) => {
          if (element.imageUrl != null) {
            element.imageUrl = environment.assetUrl + element.imageUrl;
          }
        });
        //  _data.imageUrl = environment.assetUrl + _data.imageUrl;
        this.displayArtists = this.splitArr(res["data"], 3);
      }

    }, error => {
      console.error("getArtists failed", error);
    }, () => {
      this.SpinnerService.hide();
    });
  }

  splitArr(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  initTags(lang) {

    this.appSettingsSrv.getTagOptions(lang).subscribe((data) => {
      this.tags = data;
    });
  }

  onKey(event: any) {
    // without type info
    let key = event.target.value.toLowerCase();
    let result = this.artists.filter((value) => {
      return value.name.toLowerCase().indexOf(key) != -1 ? value : null;
    });
    this.displayArtists = this.splitArr(result, 3);
    console.log("key event", key);
  }

  IsShowAllTags() {
    this.IsShowTags = !this.IsShowTags;
  }

  onfilter(value) {

    let result = this.artists.filter((artist) => {
      if (artist.tags !== null)
        return artist.tags.toLowerCase().indexOf(value) != -1 ? value : null;
    });
    this.displayArtists = this.splitArr(result, 3);
    this.filterValue = value;
  }

  onClearFilter() {
    this.filterValue = null;
    this.displayArtists = this.splitArr(this.artists, 3);
  }

  onChange(deviceValue) {
    console.log(deviceValue);
    let _artists = this.artists;

    switch (deviceValue) {
      case 'LATEST':
        _artists = this.artists.sort((a, b) => b.approvedDate - a.approvedDate);
        break;
      case 'OLDEST':
        _artists = this.artists.sort((a, b) => a.approvedDate - b.approvedDate);
        break;

      case 'POPULAR':
        _artists = this.artists.sort((a, b) => b.liked - a.liked);
        break;
    }

    this.displayArtists = this.splitArr(_artists, 3);
  }
}
