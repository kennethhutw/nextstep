import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubTabsComponent } from "../../components";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: [
    "./profile.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {

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
