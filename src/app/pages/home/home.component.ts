import {
  Component,
  OnInit,

  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {

  SettingService
} from "./../../_services";

import { GoogleAnalyticsService } from "../../_services"; // import our analytics service


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [
    "./home.component.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {



  main_bg = "./assets/images/home.svg";


  popularDisplayEditions: any = [[]];


  constructor(
    private gaSrv: GoogleAnalyticsService,
    private settingSrv: SettingService,
    private translateSrv: TranslateService,

  ) {

    // let _lang = localStorage.getItem("lang");
    // if (!this.utility.IsNullOrEmpty(_lang)) {
    //   this.translateSrv.use(_lang);
    // }
    // this.dataSrv.langKey.subscribe((lang) => {
    //   if (!this.utility.IsNullOrEmpty(lang)) {
    //     this.translateSrv.use(lang);
    //   }
    // });
  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");

  }

  setMyStyles() {
    let styles = {
      'background-image': 'url("' + this.main_bg + '")',
    };
    //{background-image: 'url( main_bg)'}
    return styles;
  }


}
