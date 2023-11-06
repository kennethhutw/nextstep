import { Component, OnInit, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { Utility } from "../../_helpers";
@Component({
  selector: "ui-radio-item",
  templateUrl: "./radio-item.component.html",
  styleUrls: ["./radio-item.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RadioItemComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() id: string;
  @Input() value: boolean = false;
  @Input() disabled: boolean = false;

  @Output() onChange = new EventEmitter<any>();
  constructor(
    private utility: Utility,
    private translateSrv: TranslateService
  ) {

  }

  ngOnInit() {

  }

  checkValue() {
    this.onChange.emit({
      id: this.id,
      value: this.value
    });
  }
}
