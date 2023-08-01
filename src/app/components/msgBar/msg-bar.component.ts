import {
  Component, OnInit, Input, Output,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";
@Component({
  selector: "app-msg-bar",
  templateUrl: "./msg-bar.component.html",
  styleUrls: ["./msg-bar.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MsgBarComponent implements OnInit {
  _project = null;
  @Input() set project(value) {
    this._project = value;
  };

  @Input() isShowEdit;
  @Input() isShowUser;
  @Input() isShowRemove;
  @Input() isShowSetting;

  @Output() onDelete = new EventEmitter<any>();
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

  onClickDelete(projectId) {
    this.onDelete.emit({
      id: projectId
    });
  }
}
