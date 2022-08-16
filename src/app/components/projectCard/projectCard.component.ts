import {
  Component,
  Output,
  Input,
  EventEmitter,
  ViewEncapsulation
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
  styleUrls: ["./projectCard.component.scss"],

  encapsulation: ViewEncapsulation.None
})
export class ProjectCardComponent {
  @Input() project;
  @Input() user;

  @Output() Collect: EventEmitter<{ projectId: any }> = new EventEmitter<{ projectId: any }>();
  @Output() UnCollect: EventEmitter<{ projectId: any }> = new EventEmitter<{ projectId: any }>();
  @Output() Follow: EventEmitter<{ projectId: any }> = new EventEmitter<{ projectId: any }>();
  @Output() UnFollow: EventEmitter<{ projectId: any }> = new EventEmitter<{ projectId: any }>();
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

  onClickCollect() {
    this.user.isCollect = !this.user.isCollect;
    this.Collect.emit({ projectId: this.project.id });
  }

  onClickUnCollect() {

    this.user.isCollect = !this.user.isCollect;
    this.UnCollect.emit({ projectId: this.project.id });
  }

  onClickFollow() {

    this.user.isFollow = !this.user.isFollow;
    this.Follow.emit({ projectId: this.project.id });
  }

  onClickUnFollow() {
    this.user.isFollow = !this.user.isFollow;
    this.UnFollow.emit({ projectId: this.project.id });
  }


}
//https://www.bootdey.com/snippets/view/Assign-Project-List#html
