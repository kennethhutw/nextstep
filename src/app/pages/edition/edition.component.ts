import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";

@Component({
  selector: "edition",
  templateUrl: "./edition.component.html",
  styleUrls: ["./edition.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EditionComponent implements OnInit {
  IsFollowed = true;
  editions = [];
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
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
    /*  this.translateSrv.setTranslation("zh-tw", {
      HELLO: "你好",
    });
    this.translateSrv.setTranslation("en", {
      HELLO: "Hello",
    }); */
    this.editions = [
      {
        id: "01",
        imageURL: "./assets/images/project-info-01.jpg",
      },
      {
        id: "02",
        imageURL: "./assets/images/project-info-02.jpg",
      },
      {
        id: "03",
        imageURL: "./assets/images/project-info-03.jpg",
      },
      {
        id: "04",
        imageURL: "./assets/images/project-info-04.jpg",
      },
      {
        id: "05",
        imageURL: "./assets/images/project-info-05.jpg",
      },
      {
        id: "06",
        imageURL: "./assets/images/project-info-06.jpg",
      },
    ];
  }

  ngOnInit() {
    // this.translateSrv.use("zh-tw");
  }
}
