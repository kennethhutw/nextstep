import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ViewsService,
  ToastService,
  NotificationService,
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
import { Router } from "@angular/router";

@Component({
  selector: "app-findmember",
  templateUrl: "./findmember.component.html",
  styleUrls: ["./findmember.component.scss"]
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

  isChat: boolean = false;
  constructor(
    private viewsSrv: ViewsService,
    public toastr: ToastService,
    private notificationSrv: NotificationService,
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private router: Router,
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
    if (this.currentUser && this.currentUser.id) {
      _id = this.currentUser.id;
    }

    this.userSrv.getPublicPartners(_id).then(res => {
      console.log("members ==========", res);
      if (res['result'] == 'successful') {
        this.items = res['data'];
        if (this.items && this.items.length > 0) {
          this.items.forEach(element => {
            if (!this.utility.IsNullOrEmpty(element.tags)) {
              element.tags = element.tags.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.interested)) {
              element.interested = element.interested.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.imageUrl)) {
              element.imageUrl = environment.assetUrl + element.imageUrl;
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
  }

  onCollect($event) {
    if ($event.isCollect && this.currentUser) {
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

  isExist(items, id) {
    let isExist = items.filter(item => item.id == id);
    if (isExist.length > 0) {
      return true;
    } else {
      return false;
    }

  }


  onClickFollow(event) {

    this.viewsSrv.follow(
      event.userId,
      "user",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.userId));
        this.items[_index].isFollow = true;
        this.notificationSrv.insert(
          this.items[_index].id,
          this.currentUser.id,
          this.currentUser.name + "開始追蹤你",
          "user",
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastr.showToast('Success', "追蹤成功 ", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "追蹤失敗", this.toastr.iconClasses.error);
      }
    });
  }

  onClickUnFollow(event) {

    this.viewsSrv.unFollow(
      event.userId,
      "user",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.userId));
        this.items[_index].isFollow = false;
        this.notificationSrv.insert(
          this.items[_index].id,
          this.currentUser.id,
          this.currentUser.name + "停止追蹤你",
          "user",
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastr.showToast('Success', "停止追蹤成功 ", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "停止追蹤失敗", this.toastr.iconClasses.error);
      }
    });
  }

  onClickCollect(event) {

    this.viewsSrv.collect(
      event.userId,
      "user",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.userId));
        this.items[_index].isCollect = true;
        this.notificationSrv.insert(
          this.items[_index].id,
          this.currentUser.id,
          this.currentUser.name + "收藏了你的檔案",
          "user",
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastr.showToast('Success', "收藏成功 ", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "收藏失敗", this.toastr.iconClasses.error);
      }
    });

  }

  onClickUnCollect(event) {

    this.viewsSrv.unCollect(
      event.userId,
      "user",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.userId));
        this.items[_index].isCollect = false;
        this.notificationSrv.insert(
          this.items[_index].id,
          this.currentUser.id,
          this.currentUser.name + "取消收藏你的檔案",
          "user",
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastr.showToast('Success', "取消收藏成功 ", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "取消收藏失敗", this.toastr.iconClasses.error);
      }
    }).catch(error => {
      console.log("取消收藏", error)
      this.toastr.showToast('Failed', "取消收藏失敗", this.toastr.iconClasses.error);
    });

  }

  OnClickProfile(event) {
    this.router.navigate(["./u/" + event.userId], {});
  }
}
