import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubTabsComponent } from "../../components";
@Component({
  selector: "app-artistprofile",
  templateUrl: "./artistprofile.component.html",
  styleUrls: ["./artistprofile.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistProfileComponent implements OnInit {
  currentTab = "artworks";
  popularEditions = [];
  constructor(private translateSrv: TranslateService) {}

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
  }


  changeTab(tab) {
    this.currentTab = tab;
  }
}