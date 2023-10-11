import { Component, Input, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";
@Component({
  selector: "app-msgAlertBox",
  templateUrl: "./msgAlertBox.component.html",
  styleUrls: ["./msgAlertBox.component.scss"],
})
export class MsgAlertBoxComponent implements OnInit {

  @Input() msg: string;
  @Input() type: string;
  constructor(
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private utility: Utility
  ) {

  }

  ngOnInit() { }

}
