import {
  Component, Output, Input,
  EventEmitter, ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
  AppSettingsService
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "ui-recruit-card",
  templateUrl: "./recruitCard.component.html",
  styleUrls: ["./recruitCard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RecruitCardComponent {
  @Input() job;
  @Input() user;

  @Output() Collect: EventEmitter<{ jobId: any }> = new EventEmitter<{ jobId: any }>();
  @Output() UnCollect: EventEmitter<{ jobId: any }> = new EventEmitter<{ jobId: any }>();
  @Output() Apply: EventEmitter<any> = new EventEmitter<any>();

  skillOptions = [];
  constructor(
    private utility: Utility,
    private router: Router,
    private dataSrv: DataService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService
  ) {

    this.skillOptions = this.appSettingsSrv.skillOptions();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.skillOptions = this.appSettingsSrv.skillOptionsWithLang(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.skillOptions = this.appSettingsSrv.skillOptionsWithLang(lang);
      }
    });
  }


  routeToUserProfile() {
    this.router.navigate(["./job/" + this.job.id], {});
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }

  convertTag(term) {

    let _index = this.skillOptions.findIndex((obj => obj.value == term.toLowerCase()));
    if (_index > 0) {
      return this.skillOptions[_index].text;
    }

  }

  onClickApply(event, item) {
    event.stopPropagation();
    this.Apply.emit(this.job);
  }

  onClickCollect(event) {
    event.stopPropagation();
    this.user.isCollect = !this.user.isCollect;
    this.Collect.emit({ jobId: this.job.id });
  }

  onClickUnCollect(event) {
    event.stopPropagation();
    this.user.isCollect = !this.user.isCollect;
    this.UnCollect.emit({ jobId: this.job.id });
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultProjectIcon.png";
  }

}
//https://www.bootdey.com/snippets/view/Assign-Project-List#html
