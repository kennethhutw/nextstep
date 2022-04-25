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
  selector: "app-findmember",
  templateUrl: "./findmember.component.html",
  styleUrls: ["./findmember.component.css"]
})
export class FindMemberComponent implements OnInit {

  items = [];
  displayItems = [];
  currentUser;
  values = "";
  tags = [];
  IsShowTags = false;
  defaultProfileLogo = null;
  filterValue = null;
  searchText = '';
  filterCondition = {
    online: true,
    offline: true,
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
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();
    let _id = null;
    if (this.currentUser.id) {
      _id = this.currentUser.id;
    }

    this.userSrv.getPublicPartners(_id).then(res => {
      console.log("===========", res);
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

    this.translateSrv.use("zh-tw");
    this.SpinnerService.hide();
    this.displayItems = this.items;
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


  IsShowAllTags() {
    this.IsShowTags = !this.IsShowTags;
  }

  onfilter(value) {


  }

  onClearFilter() {
    this.filterValue = null;

  }

  onChange(deviceValue) {
    let _items = this.items;

    // switch (deviceValue) {
    //   case 'LATEST':
    //     _items = this.items.sort((a, b) => b.approvedDate - a.approvedDate);
    //     break;
    //   case 'OLDEST':
    //     _items = this.items.sort((a, b) => a.approvedDate - b.approvedDate);
    //     break;

    //   case 'POPULAR':
    //     _items = this.items.sort((a, b) => b.liked - a.liked);
    //     break;
    // }

    // this.displayItems = this.splitArr(_items, 3);
  }

  onLine(event) {
    if (this.filterCondition.online && this.filterCondition.offline) {
      this.displayItems = this.items;
    } else if (!this.filterCondition.online && this.filterCondition.offline) {
      let items = this.items.filter(item => {
        return item.offline == 1
      })
      this.displayItems = items.filter(item => {
        return item.online == 0
      })
    } else if (this.filterCondition.online && !this.filterCondition.offline) {
      let items = this.items.filter(item => {
        return item.online == 1
      })
      this.displayItems = items.filter(item => {
        return item.offline == 0
      })

    } else if (!this.filterCondition.online && !this.filterCondition.offline) {
      this.displayItems = [];
    }
    // if (this.displayItems.length > 0)
    //   this.checkWorkTime(this.displayItems)
    // if (this.displayItems.length > 0)
    //   this.checkType(this.displayItems)
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
      this.displayItems = [];
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

    // if (this.displayItems.length > 0)
    //   this.checkProject(this.displayItems)
    // if (this.displayItems.length > 0)
    //   this.checkType(this.displayItems)
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
