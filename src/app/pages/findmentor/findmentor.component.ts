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
  selector: "app-find-mentor",
  templateUrl: "./findmentor.component.html",
  styleUrls: ["./findmentor.component.scss"]
})
export class FindMentorComponent implements OnInit {
  filterCondition = {
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
  }
  items = [];
  displayItems = [];
  currentUser;

  isChat: boolean = false;
  reciver;
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

  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();
    let _id = null;
    if (this.currentUser && this.currentUser.id) {
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
            if (!this.utility.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.interested)) {
              element.interested = element.interested.split(',');
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
    // this.displayItems = this.items;
    //  this.SpinnerService.hide();
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
      this.displayItems = this.items;
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


  onToggleChat(event) {
    this.isChat = !this.isChat;
    this.reciver = null;
  }

  onClickChat(event) {

    this.isChat = !this.isChat;
    this.reciver = event;
  }

  OnClickProfile(event) {
    this.router.navigate(["./mentor/" + event.userId], {});
  }
}
