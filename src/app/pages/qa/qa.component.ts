import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-qa",
  templateUrl: "./qa.component.html",
  styleUrls: ["./qa.component.css"]
})
export class QAComponent implements OnInit {
  constructor(private translateSrv: TranslateService) {

  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

}
