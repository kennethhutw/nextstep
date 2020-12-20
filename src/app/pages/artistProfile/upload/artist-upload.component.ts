import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-upload",
  templateUrl: "./artist-upload.component.html",
  styleUrls: ["./artist-upload.component.css"],
})
export class ArtistUploadComponent implements OnInit {
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
