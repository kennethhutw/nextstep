import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-sales",
  templateUrl: "./artist-sales.component.html",
  styleUrls: ["./artist-sales.component.css"],
})
export class ArtistSalesComponent implements OnInit {

  constructor(private translateSrv: TranslateService) {}

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

}
