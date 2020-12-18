import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-collector-sales",
  templateUrl: "./collector-sales.component.html",
  styleUrls: ["./collector-sales.component.css"],
})
export class CollectorSalesComponent implements OnInit {

  constructor(private translateSrv: TranslateService) {}

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

}
