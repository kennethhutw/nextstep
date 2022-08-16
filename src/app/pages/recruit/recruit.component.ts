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
  onSkills(event) {

    if (this.filterCondition.design &&
      this.filterCondition.finance &&
      this.filterCondition.marketing &&
      this.filterCondition.product &&
      this.filterCondition.public &&
      this.filterCondition.sale &&
      this.filterCondition.funding &&
      this.filterCondition.law &&
      this.filterCondition.strategy &&
      this.filterCondition.programming) {
      this.displayItems = this.items;
    } else if (!this.filterCondition.design &&
      !this.filterCondition.finance &&
      !this.filterCondition.marketing &&
      !this.filterCondition.product &&
      !this.filterCondition.public &&
      this.filterCondition.sale &&
      this.filterCondition.funding &&
      this.filterCondition.law &&
      this.filterCondition.strategy &&
      this.filterCondition.programming) {
      this.displayItems = [];
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.design &&
          item.skills.indexOf('design') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.finance &&
          item.skills.indexOf('finance') > -1) {

          currentItem.push(item);

        }
        if (this.filterCondition.marketing &&
          item.skills.indexOf('marketing') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.product &&
          item.skills.indexOf('product') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.public &&
          item.skills.indexOf('public') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.sale &&
          item.skills.indexOf('sale') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.funding &&
          item.skills.indexOf('funding') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.law &&
          item.skills.indexOf('law') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.strategy &&
          item.skills.indexOf('strategy') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.programming &&
          item.skills.indexOf('programming') > -1) {
          currentItem.push(item);
        }
        this.displayItems = currentItem;
      })

    }

    if (this.displayItems.length > 0)
      this.checkWorkTime(this.displayItems);
    if (this.displayItems.length > 0)
      this.checkLine(this.displayItems);
    this.finalCheck();
  }

  onHourChange(event) {
    if (this.filterCondition.work12 &&
      this.filterCondition.work34 &&
      this.filterCondition.work56 &&
      this.filterCondition.work78 &&
      this.filterCondition.work9) {
      this.displayItems = this.items;
    } else if (!this.filterCondition.work12 &&
      !this.filterCondition.work34 &&
      !this.filterCondition.work56 &&
      !this.filterCondition.work78 &&
      !this.filterCondition.work9) {
      this.displayItems = this.items;
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.work12 && item.work12) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work34 && item.work34) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work56 && item.work56) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work78 && item.work78) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work9 && item.work9) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }

        this.displayItems = currentItem;
      })

    }

    if (this.displayItems.length > 0)
      this.checkSkills(this.displayItems);
    if (this.displayItems.length > 0)
      this.checkLine(this.displayItems);
    this.finalCheck();
  }

  checkLine(items) {
    if (this.filterCondition.online && this.filterCondition.offline) {
      this.displayItems = items;
    } else if (!this.filterCondition.online && this.filterCondition.offline) {
      this.displayItems = items.filter(item => {
        return item.online == 0 && item.offline == 1
      })
    } else if (this.filterCondition.online && !this.filterCondition.offline) {
      this.displayItems = items.filter(item => {
        return item.offline == 0 && item.online == 1
      })
    } else if (!this.filterCondition.online && !this.filterCondition.offline) {
      this.displayItems = items;
    }
  }

  checkSkills(items) {

    if (this.filterCondition.design &&
      this.filterCondition.finance &&
      this.filterCondition.marketing &&
      this.filterCondition.product &&
      this.filterCondition.public &&
      this.filterCondition.sale &&
      this.filterCondition.funding &&
      this.filterCondition.law &&
      this.filterCondition.strategy &&
      this.filterCondition.programming) {
      this.displayItems = items;
    } else if (!this.filterCondition.design &&
      !this.filterCondition.finance &&
      !this.filterCondition.marketing &&
      !this.filterCondition.product &&
      !this.filterCondition.public &&
      this.filterCondition.sale &&
      this.filterCondition.funding &&
      this.filterCondition.law &&
      this.filterCondition.strategy &&
      this.filterCondition.programming) {
      this.displayItems = items;
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.design &&
          item.skills.indexOf('design') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.finance &&
          item.skills.indexOf('finance') > -1) {

          currentItem.push(item);

        }
        if (this.filterCondition.marketing &&
          item.skills.indexOf('marketing') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.product &&
          item.skills.indexOf('product') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.public &&
          item.skills.indexOf('public') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.sale &&
          item.skills.indexOf('sale') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.funding &&
          item.skills.indexOf('funding') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.law &&
          item.skills.indexOf('law') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.strategy &&
          item.skills.indexOf('strategy') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.programming &&
          item.skills.indexOf('programming') > -1) {
          currentItem.push(item);
        }
        this.displayItems = currentItem;
      })

    }


  }

  checkWorkTime(items) {
    let currentItem = []
    if (!this.filterCondition.work12 &&
      !this.filterCondition.work34 &&
      !this.filterCondition.work56 &&
      !this.filterCondition.work78 &&
      !this.filterCondition.work9) {
      this.displayItems = items;
    } else if (this.filterCondition.work12 &&
      this.filterCondition.work34 &&
      this.filterCondition.work56 &&
      this.filterCondition.work78 &&
      this.filterCondition.work9) {
      this.displayItems = items;
    } else {
      items.map(item => {
        if (this.filterCondition.work12 && item.work12) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work34 && item.work34) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work56 && item.work56) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work78 && item.work78) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.work9 && item.work9) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }

        this.displayItems = currentItem;
      })
    }

  }

  finalCheck() {
    if (
      this.filterCondition.design &&
      this.filterCondition.finance &&
      this.filterCondition.marketing &&
      this.filterCondition.product &&
      this.filterCondition.public &&
      this.filterCondition.sale &&
      this.filterCondition.funding &&
      this.filterCondition.law &&
      this.filterCondition.strategy &&
      this.filterCondition.programming &&
      this.filterCondition.work12 &&
      this.filterCondition.work34 &&
      this.filterCondition.work56 &&
      this.filterCondition.work78 &&
      this.filterCondition.work9) {
      this.displayItems = this.items;;
    } else if (
      !this.filterCondition.design &&
      !this.filterCondition.finance &&
      !this.filterCondition.marketing &&
      !this.filterCondition.product &&
      !this.filterCondition.public &&
      !this.filterCondition.sale &&
      !this.filterCondition.funding &&
      !this.filterCondition.law &&
      !this.filterCondition.strategy &&
      !this.filterCondition.programming &&
      !this.filterCondition.work12 &&
      !this.filterCondition.work34 &&
      !this.filterCondition.work56 &&
      !this.filterCondition.work78 &&
      !this.filterCondition.work9) {
      this.displayItems = this.items;
    }
  }

  onCleanClick() {
    this.filterCondition.online = false,
      this.filterCondition.offline = false;
    this.filterCondition.design = false;
    this.filterCondition.finance = false;
    this.filterCondition.marketing = false;
    this.filterCondition.product = false;
    this.filterCondition.public = false;
    this.filterCondition.sale = false;
    this.filterCondition.funding = false;
    this.filterCondition.law = false;
    this.filterCondition.strategy = false;
    this.filterCondition.programming = false;
    this.filterCondition.work12 = false;
    this.filterCondition.work34 = false;
    this.filterCondition.work56 = false;
    this.filterCondition.work78 = false;
    this.filterCondition.work9 = false;
    this.displayItems = this.items;
  }


  onLine(event) {
    if (this.filterCondition.online && this.filterCondition.offline) {
      this.displayItems = this.items;
    } else if (!this.filterCondition.online && this.filterCondition.offline) {
      this.displayItems = this.items.filter(item => {
        return item.online == 0 && item.offline == 1
      })
    } else if (this.filterCondition.online && !this.filterCondition.offline) {
      this.displayItems = this.items.filter(item => {
        return item.offline == 0 && item.online == 1
      })
    } else if (!this.filterCondition.online && !this.filterCondition.offline) {
      this.displayItems = this.items;
    }
    if (this.displayItems.length > 0)
      this.checkWorkTime(this.displayItems);
    if (this.displayItems.length > 0)
      this.checkSkills(this.displayItems);
    this.finalCheck();

  }

  isExist(items, id) {
    let isExist = items.filter(item => item.id == id);
    if (isExist.length > 0) {
      return true;
    } else {
      return false;
    }

  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
