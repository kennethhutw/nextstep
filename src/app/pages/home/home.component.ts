import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  ArtWorkService,
  SettingService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
import { GoogleAnalyticsService } from "../../_services"; // import our analytics service



@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [
    "./../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css",
    "./home.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  popularEditions = [];
  recentEditions = [];


  default_main_bg = "./assets/images/main-bg.jpg";

  main_bg = "./assets/images/main-bg.jpg";


  popularDisplayEditions: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(
    private gaSrv: GoogleAnalyticsService,
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private artworkSrv: ArtWorkService
  ) {

    this.settingSrv.getSetting('main_bg').subscribe(res => {
      if (res["result"] == "successful") {
        this.main_bg = environment.assetUrl + res["data"];
      }
    })
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {

    this.artworkSrv.getPopularArtwork().subscribe(res => {
      console.log("==============", res);
      if (res["result"] == "successful") {
        this.popularEditions = res["data"];
        this.popularEditions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          element.thumbnail = environment.assetUrl + element.thumbnail;
          element.ethValue = element.ethValue / 100;
        });
        // this.popularDisplayEditions = this.chunk(this.popularEditions, 3);
      }
    });

    this.artworkSrv.getLatestArtWork().subscribe(res => {

      if (res["result"] == "successful") {
        this.recentEditions = res["data"];
        this.recentEditions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          element.thumbnail = environment.assetUrl + element.thumbnail;
          element.ethValue = element.ethValue / 100;
        });
      }
    });

  }

  setMyStyles() {
    let styles = {
      'background-image': 'url("' + this.main_bg + '")',
    };
    //{background-image: 'url( main_bg)'}
    return styles;
  }

  SendLikeEvent(editionId) {
    //We call the event emmiter function from our service and pass in the details
    this.gaSrv.eventEmitter("artwork", "view", "artwork", editionId);
  }
}
