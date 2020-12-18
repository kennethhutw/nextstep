import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";

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

  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
    /*  this.translateSrv.setTranslation("zh-tw", {
      HELLO: "你好",
    });
    this.translateSrv.setTranslation("en", {
      HELLO: "Hello",
    }); */
  }

  ngOnInit() {
    this.popularEditions = [
      {
        editionTitle: "The Calm And The Storm too more words",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-a1.jpg",
        editionId: "2000123",
      },
      {
        editionTitle: "The Calm And The Storm",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-a2.jpg",
        editionId: "2000124",
      },
      {
        editionTitle: "The Calm And The Storm too more words",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-a3.jpg",
        editionId: "2000125",
      },
    ];
    this.recentEditions = [
      {
        editionTitle: "The Calm And The Storm too more words",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
        editionId: "2000123",
      },
      {
        editionTitle: "The Calm And The Storm",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
        editionId: "2000124",
      },
      {
        editionTitle: "The Calm And The Storm too more words",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
        editionId: "2000123",
      },
      {
        editionTitle: "The Calm And The Storm",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
        editionId: "2000124",
      },
      {
        editionTitle: "The Calm And The Storm too more words",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
        editionId: "2000123",
      },
      {
        editionTitle: "The Calm And The Storm",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
        editionId: "2000124",
      },
      {
        editionTitle: "The Calm And The Storm too more words",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
        editionId: "2000123",
      },
      {
        editionTitle: "The Calm And The Storm",
        editionAuthor: "Andrew Shiao",
        editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
        editionId: "2000124",
      },
    ];
  }
}
