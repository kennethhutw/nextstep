import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-collector-offer",
  templateUrl: "./collector-offer.component.html",
  styleUrls: ["./collector-offer.component.css"],
})
export class CollectorOfferComponent implements OnInit {

  constructor(private translateSrv: TranslateService) {}

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

}
