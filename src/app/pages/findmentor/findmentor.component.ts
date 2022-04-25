import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  UserService,
  DataService,
  LikeService,
  SettingService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-find-mentor",
  templateUrl: "./findmentor.component.html",
  styleUrls: ["./findmentor.component.css"]
})
export class FindMentorComponent implements OnInit {
  filterCondition = {

    design: true,
    finance: true,
    marketing: true,
    product: true,
    public: true,
    sale: true,
    funding: true,
    law: true,
    strategy: true,
    programming: true,
    work12: true,
    work34: true,
    work56: true,
    work78: true,
    work9: true

  }
  items = [];
  displayItems = [];
  currentUser;
  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStore: AuthStore,
    private userSrv: UserService,
    private likeSrv: LikeService,
    private SpinnerService: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();
    let _id = null;
    if (this.currentUser.id) {
      _id = this.currentUser.id;
    }

    this.userSrv.getPublicMentors(_id).then(res => {
      if (res['result'] == 'successful') {
        this.items = res['data'];
        if (this.items && this.items.length > 0) {
          this.items.forEach(element => {
            if (!this.utility.IsNullOrEmpty(element.tags)) {
              element.tags = element.tags.split(',');
            }
          });
        }
        this.displayItems = this.items ? this.items : [];
      }
      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })
    // let _lang = localStorage.getItem("lang");
    // if (!this.utility.IsNullOrEmpty(_lang)) {
    //   this.translateSrv.use(_lang);

    // } else {
    //   let _browserLang = this.translateSrv.getBrowserLang();
    //   this.translateSrv.use(_browserLang);

    // }
    // this.dataSrv.langKey.subscribe((lang) => {
    //   if (!this.utility.IsNullOrEmpty(lang)) {
    //     this.translateSrv.use(lang);

    //   }
    // });
    this.translateSrv.use("zh-tw");
    this.displayItems = this.items;
    this.SpinnerService.hide();
  }

  onCollect($event) {
    if ($event.isCollect) {
      this.likeSrv.like(this.currentUser.id, $event.id, $event.type).subscribe(res => {
        if (res['result'] == 'successful') {

        }
      })
    } else {
      this.likeSrv.removeLike(this.currentUser.id, $event.id, $event.type).subscribe(res => {
        if (res['result'] == 'successful') {

        }
      })
    }
  }


  onKey(event: any) {

  }


  onfilter(value) {


  }

  onClearFilter() {

  }

  onChange(deviceValue) {

  }

  onSkills(event) {
    this.displayItems = [];
    console.log("onSkills===================", event)
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
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.finance &&
          item.skills.indexOf('finance') > -1) {

          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }

        }
        if (this.filterCondition.marketing &&
          item.skills.indexOf('marketing') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.product &&
          item.skills.indexOf('product') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.public &&
          item.skills.indexOf('public') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.sale &&
          item.skills.indexOf('sale') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.funding &&
          item.skills.indexOf('funding') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.law &&
          item.skills.indexOf('law') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.strategy &&
          item.skills.indexOf('strategy') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.programming &&
          item.skills.indexOf('programming') > -1) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        this.displayItems = currentItem;
      })

    }


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
