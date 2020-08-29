import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artists",
  templateUrl: "./artists.component.html",
  styleUrls: [
    "./artists.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistsComponent implements OnInit {



  constructor(private translateSrv: TranslateService) {

  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }



}
