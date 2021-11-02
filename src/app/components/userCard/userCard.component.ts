import { Component, ViewEncapsulation, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-user-card",
  templateUrl: "./userCard.component.html",
  styleUrls: ["./userCard.component.css"]
})
export class UserCardComponent {
  @Input() user;


  constructor(
    private utility: Utility,
    private router: Router,
    private dataSrv: DataService,
    private translateSrv: TranslateService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }


  routeToUserProfile() {
    this.router.navigate(["./u/" + this.user.id], {});
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }
}
