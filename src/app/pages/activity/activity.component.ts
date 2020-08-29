import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubTabsComponent } from "../../components";
@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: [
    "./activity.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ActivityComponent implements OnInit {

  currentTab = 'collection';

  constructor(private translateSrv: TranslateService) {

  }

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
