import {
  Component, OnInit, Input, Output,
  EventEmitter
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import {
  DataService,
  DialogService
} from "../../_services";
@Component({
  selector: "app-project-bar",
  templateUrl: "./project-bar.component.html",
  styleUrls: ["./project-bar.component.css"]
})
export class ProjectBarComponent implements OnInit {
  _project = null;
  @Input() set project(value) {
    this._project = value;
  };


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
