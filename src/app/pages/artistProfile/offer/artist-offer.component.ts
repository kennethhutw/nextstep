import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-offer",
  templateUrl: "./artist-offer.component.html",
  styleUrls: ["./artist-offer.component.css"],
})
export class ArtistOfferComponent implements OnInit {

  constructor(private translateSrv: TranslateService) {}

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

}
