import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import { DataService } from "../../_services";
@Component({
  selector: "app-member-card",
  templateUrl: "./memberCard.component.html",
  styleUrls: ["./memberCard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MemberCardComponent implements OnInit {
  @Input() name: string;
  @Input() position: string;
  @Input() imageUrl: string;
  @Input() tags;
  @Input() uid: string;
  @Input() user;

  strNoName: string;
  strNoPosition: string;

  constructor(
    private utility: Utility,
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private router: Router
  ) {
    let _lang = localStorage.getItem("lang");
    this.init_terms();
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.init_terms();
    }
  }

  init_terms() {
    this.translateSrv.get("NONAME").subscribe((text: string) => {
      this.strNoName = text;
    });

    this.translateSrv.get("NOPOISTION").subscribe((text: string) => {
      this.strNoPosition = text;
    });
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }


  routeToUserProfile() {
    this.router.navigate(["./u/" + this.uid], {});
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }


}
