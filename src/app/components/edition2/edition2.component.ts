import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import { DataService } from "../../_services";
@Component({
  selector: "app-edition2",
  templateUrl: "./edition2.component.html",
  styleUrls: ["./edition2.component.css"],
})
export class Edition2Component implements OnInit {
  @Input() editionTitle: string;
  @Input() editionAuthor: string;
  @Input() editionImg: string;
  @Input() editionId: string;
  @Input() artworkId: string;

  constructor(
    private utility: Utility,
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private router: Router
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

  ViewDetails() {
    this.router.navigate(["/gallery/" + this.editionId]);
  }
}
