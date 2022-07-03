import {
  Component, Output, Input,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "ui-project-card",
  templateUrl: "./projectCard.component.html",
  styleUrls: ["./projectCard.component.scss"]
})
export class ProjectCardComponent {
  @Input() project;
  @Input() user;

  @Output() onCollect: EventEmitter<{ projectId: any, isCollect: any }> = new EventEmitter<{ projectId: any, isCollect: any }>();
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
    this.router.navigate(["./project/" + this.project.id], {});
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }


}
//https://www.bootdey.com/snippets/view/Assign-Project-List#html
