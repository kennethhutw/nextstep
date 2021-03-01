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


  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private artworkSrv: ArtWorkService
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


    this.artworkSrv.getSellArtwork().subscribe(res => {

      if (res["result"] == "successful") {
        this.editions = res["data"];
        this.editions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          element.ethPrice = utility.getSellETHPrice(element.usdValue);
        });
        this.displayEditions = this.editions;
        console.log("this.editions ==============", this.editions);
      }
    });
    // this.editions = [
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-01.jpg",
    //     editionId: "2000163",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.5",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-02.jpg",
    //     editionId: "2000135",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.11",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-03.jpg",
    //     editionId: "2000136",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.15",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-04.jpg",
    //     editionId: "2000137",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.09",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-05.jpg",
    //     editionId: "2000138",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.04",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-06.jpg",
    //     editionId: "2000139",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.07",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-07.jpg",
    //     editionId: "2000143",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.09",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-08.jpg",
    //     editionId: "2000401",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.08",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-09.jpg",
    //     editionId: "2000141",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.015",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-10.jpg",
    //     editionId: "2000142",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.05",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./assets/images/card-11.jpg",
    //     editionId: "2000143",
    //     editionDate: "2020-3-15",
    //     editionPrice: "0.7",
    //   },
    // ];

    // this.editionSrv.getEditionByArtistId(this.currentUser.id).subscribe(res => {
    //   if (res['result'] === 'successful') {
    //     this.editions = res['data'];
    //   }
    //   else {

    //   }
    // }, err => {
    //   console.error(`getArtwrokByArtistId failed ${err}`);
    // });
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

  }
}
