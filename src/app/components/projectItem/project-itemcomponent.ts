import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import { DataService } from "../../_services";
@Component({
  selector: "app-project-item",
  templateUrl: "./project-item.component.html",
  styleUrls: ["./project-item.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectItemComponent implements OnInit {
  @Input() title: string;
  @Input() img: string;
  @Input() id: string;
  @Input() description: string;
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
    this.router.navigate(["/project/" + this.id]);
  }
}
