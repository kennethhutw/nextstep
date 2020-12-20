import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-basic",
  templateUrl: "./artist-basic.component.html",
  styleUrls: ["./artist-basic.component.css"],
})
export class ArtistBasicComponent implements OnInit {
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
