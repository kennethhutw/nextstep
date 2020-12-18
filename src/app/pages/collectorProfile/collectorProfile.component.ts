import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubTabsComponent } from "../../components";
@Component({
  selector: "app-collectorProfile",
  templateUrl: "./collectorProfile.component.html",
  styleUrls: ["./collectorProfile.component.css"],
})
export class CollectorProfilePageComponent implements OnInit {
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
