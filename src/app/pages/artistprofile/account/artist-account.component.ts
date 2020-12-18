import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-account",
  templateUrl: "./artist-account.component.html",
  styleUrls: ["./artist-account.component.css"],
})
export class ArtistAccountComponent implements OnInit {
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
