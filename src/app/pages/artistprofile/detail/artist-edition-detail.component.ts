import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-edition-detail",
  templateUrl: "./artist-edition-detail.component.html",
  styleUrls: ["./artist-edition-detail.component.css"],
})
export class ArtistEditionDetailComponent implements OnInit {
  currentTab = "artworks";
  popularEditions = [];
  constructor(private translateSrv: TranslateService) {}

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }
  changeTab(tab) {
    this.currentTab = tab;
  }
}
