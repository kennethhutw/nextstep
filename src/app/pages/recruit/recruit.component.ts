import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RecruitService,
  AppSettingsService,
  SettingService
} from "../../_services";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import {
  AuthStore
} from "../../_services/auth.store";
@Component({
  selector: "app-recruit",
  templateUrl: "./recruit.component.html",
  styleUrls: ["./recruit.component.scss"]
})
export class RecruitComponent implements OnInit {
  items = [];
  displayItems = [];
  currentRecruit;
  selectedItem;
  filterCondition = {
    online: false,
    offline: false,
    design: false,
    finance: false,
    marketing: false,
    product: false,
    public: false,
    sale: false,
    funding: false,
    law: false,
    strategy: false,
    programming: false,
    work12: false,
    work34: false,
    work56: false,
    work78: false,
    work9: false

  }
  currentUser;
  constructor(
    private authStore: AuthStore,
    private settingSrv: SettingService,
    private recruitSrv: RecruitService,
    private utility: Utility,
    private route: ActivatedRoute,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();
    this.recruitSrv.get().then(res => {
      console.log("result =========", res);
      if (res['result'] == 'successful') {
        this.items = res['data'];
        if (this.items && this.items.length > 0) {
          this.items.forEach(element => {

            if (!this.utility.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
          });
        }
        this.displayItems = this.items;
      }
      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })
  }

  onSave() { }

  onSelectItem(item) {
    this.selectedItem = item;
  }

  onSubmit() {

  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
