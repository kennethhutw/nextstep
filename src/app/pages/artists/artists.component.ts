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

  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private artistSrv: ArtistService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.initTags(_lang);
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
      console.log("res ==============", res);
      if (res["result"] === "successful") {
        this.artists = res["data"];
        this.artists.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
        });
        //  _data.imageUrl = environment.assetUrl + _data.imageUrl;
        this.displayArtists = this.splitArr(res["data"], 3);
      }

    }, error => {
      console.error("getArtists failed", error);
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
}
