import {
  Component, EventEmitter, Input,
  Output
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-user-card",
  templateUrl: "./userCard.component.html",
  styleUrls: ["./userCard.component.css"]
})
export class UserCardComponent {
  @Input() user;
  @Input() type;
  @Input() currentuser;

  @Output() onCollect: EventEmitter<{
    id: any,
    isCollect: any,
    type: string
  }> = new EventEmitter<{
    id: any,
    isCollect: any,
    type: string
  }>();
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
    this.router.navigate(["./u/" + this.user.id], {});
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
    this.onCollect.emit({ id: this.user.id, isCollect: this.user.isCollect, type: this.type });
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }
}
