import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ViewsService,
  NotificationService,
  RecruitService,
  DataService,

  MembersService,
  ToastService
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

  @ViewChild('closebutton') closebutton;

  items = [];
  displayItems = [];
  foundItemNum: number = -1;
  currentRecruit;
  selectedItem;
  filterCondition = {
    online: false,
    offline: false,
    design: false,
    finance: false,
    market: false,
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

  selectedApplication: any;

  defual_application_message: string = ``;

  application_message: string;

  msg = {
    startfollow: "",
    stopfollow: "",
    collectla: "",
    uncollectla: "",
    wantapply: ""
  }
  constructor(
    private viewsSrv: ViewsService,
    private notificationSrv: NotificationService,
    private authStore: AuthStore,
    private membersSrv: MembersService,
    public toastSrv: ToastService,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private recruitSrv: RecruitService,
    private utilitySrv: Utility,

    private SpinnerService: NgxSpinnerService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.toastSrv.changeLang(this.translateSrv);
      this.init_terms();

    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.toastSrv.changeLang(this.translateSrv);
        this.init_terms();
      }
    });
  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();
    let _id = null;
    if (this.currentUser && this.currentUser.id) {
      _id = this.currentUser.id;
    }
    this.recruitSrv.get(_id).then(res => {

      if (res['result'] == 'successful') {
        this.items = res['data'];
        if (this.items && this.items.length > 0) {
          this.items.forEach(element => {

            if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }

            if (!this.utilitySrv.IsNullOrEmpty(element.projectImageUrl)) {
              element.projectImageUrl = environment.assetUrl + element.projectImageUrl;
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

  init_terms() {
    this.translateSrv.get("STARTFOLLOW").subscribe((text: string) => {
      this.msg.startfollow = text;
    });

    this.translateSrv.get("STOPFOLLOW").subscribe((text: string) => {
      this.msg.stopfollow = text;
    });

    this.translateSrv.get("COLLECTLA").subscribe((text: string) => {
      this.msg.collectla = text;
    });

    this.translateSrv.get("UNCOLLECT").subscribe((text: string) => {
      this.msg.uncollectla = text;
    });

    this.translateSrv.get("APPMSG").subscribe((text: string) => {
      this.defual_application_message = text;
      this.application_message = this.defual_application_message;
    });

    this.translateSrv.get("WANTAPPLY").subscribe((text: string) => {
      this.msg.wantapply = text;

    });
  }

  onSkills(event) {

    if (this.filterCondition.design &&
      this.filterCondition.finance &&
      this.filterCondition.market &&
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
      !this.filterCondition.market &&
      !this.filterCondition.marketing &&
      !this.filterCondition.product &&
      !this.filterCondition.public &&
      !this.filterCondition.sale &&
      !this.filterCondition.funding &&
      !this.filterCondition.law &&
      !this.filterCondition.strategy &&
      !this.filterCondition.programming) {
      this.displayItems = [];
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.design &&
          item.skills.indexOf('design') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.design &&
          item.skills.some(r => ["3d", "uiux",
            "graphic"].indexOf(r) >= 0)) {
          currentItem.push(item);
        }
        if (this.filterCondition.finance &&
          item.skills.indexOf('finance') > -1) {
          currentItem.push(item);

        }
        if (this.filterCondition.finance &&
          item.skills.some(r => ["accounting", "sale"].indexOf(r) >= 0)) {
          currentItem.push(item);
        }

        if (this.filterCondition.market &&
          item.skills.indexOf('market') > -1) {
          currentItem.push(item);
        }

        if (this.filterCondition.market &&
          item.skills.some(r => ["analysis", "sale",
            "entity", "channel", "bd"].indexOf(r) >= 0)) {
          currentItem.push(item);
        }
        if (this.filterCondition.marketing &&
          item.skills.indexOf('marketing') > -1) {
          currentItem.push(item);
        }

        if (this.filterCondition.marketing &&
          item.skills.some(r => ["video", "hacker",
            "advertising", "editor", "community", "it"].indexOf(r) >= 0)) {
          currentItem.push(item);
        }
        if (this.filterCondition.product &&
          item.skills.indexOf('product') > -1) {
          currentItem.push(item);
        }
        if (this.filterCondition.product &&
          item.skills.some(r => ["product", "project"].indexOf(r) >= 0)) {
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
        if (this.filterCondition.law &&
          item.skills.some(r => ["law"].indexOf(r) >= 0)) {
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

        if (this.filterCondition.programming &&
          item.skills.some(r => ["frontend", "backend",
            "fullstack", "mobile",
            "qa", "devops", "it", "datamining"].indexOf(r) >= 0)) {
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
      this.filterCondition.market &&
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
      !this.filterCondition.market &&
      !this.filterCondition.marketing &&
      !this.filterCondition.product &&
      !this.filterCondition.public &&
      !this.filterCondition.sale &&
      !this.filterCondition.funding &&
      !this.filterCondition.law &&
      !this.filterCondition.strategy &&
      !this.filterCondition.programming) {
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
        if (this.filterCondition.market &&
          item.skills.indexOf('market') > -1) {
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
      this.filterCondition.market &&
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
      this.displayItems = this.items;
    } else if (
      !this.filterCondition.design &&
      !this.filterCondition.finance &&
      !this.filterCondition.market &&
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
    if (this.displayItems.length == this.items.length) {
      this.foundItemNum = -1;
    } else {
      this.foundItemNum = this.displayItems.length;
    }

  }

  onCleanClick() {
    this.filterCondition.online = false,
      this.filterCondition.offline = false;
    this.filterCondition.design = false;
    this.filterCondition.finance = false;
    this.filterCondition.marketing = false;
    this.filterCondition.market = false;
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
      this.foundItemNum = -1;
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
      this.foundItemNum = -1;
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

  onClickApply(event) {

    this.selectedApplication = event;
  }

  onClickCollect(event) {

    this.viewsSrv.collect(
      event.jobId,
      "application",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.jobId));
        this.items[_index].isCollect = true;
        this.notificationSrv.insert(
          this.items[_index].createdBy,
          this.currentUser.id,
          this.currentUser.name + this.msg.collectla + " [" + this.items[_index].projectName + "] - [" + this.items[_index].position + "]",
          this.notificationSrv.types.application,
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastSrv.showToast('Success',
          this.toastSrv.collectStr + this.toastSrv.successfulStr,
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('Failed',
          this.toastSrv.collectStr + this.toastSrv.failedStr,
          this.toastSrv.iconClasses.error);
      }
    });
  }

  onClickUnCollect(event) {
    this.viewsSrv.unCollect(
      event.jobId,
      "application",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.jobId));
        this.items[_index].isCollect = false;
        this.notificationSrv.insert(
          this.items[_index].createdBy,
          this.currentUser.id,
          this.currentUser.name + this.msg.uncollectla + "[" + this.items[_index].projectName + "] - [" + this.items[_index].position + "]",
          this.notificationSrv.types.application,
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastSrv.showToast('Success',
          this.toastSrv.uncollectStr + this.toastSrv.successfulStr,
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('Failed',
          this.toastSrv.uncollectStr + this.toastSrv.failedStr,
          this.toastSrv.iconClasses.error);
      }
    }).catch(error => {
      console.log("取消收藏", error)
      this.toastSrv.showToast('Failed',
        this.toastSrv.uncollectStr + this.toastSrv.failedStr,
        this.toastSrv.iconClasses.error);
    });
  }

  onSubmitApplication(application) {
    const params = {
      projectId: application.projectId,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      startDate: "",
      endDate: "",
      role: "candidate",
      position: application.position,
      scopes: application.scopes,
      isAdmin: "0",
      isOwner: "0",
      status: "new",
      available: "0",
      recruitId: application.id,
      uid: this.currentUser.id,
    }
    this.membersSrv.apply(
      params
    ).then(res => {
      if (res["result"] == "successful") {
        this.toastSrv.showToast('Success',
          this.toastSrv.applysendsuc,
          this.toastSrv.iconClasses.success);
        this.selectedApplication = null;

        this.notificationSrv.infoProjectMembers(application.projectId,
          this.currentUser.id,
          `${this.currentUser.name}  ${this.msg.wantapply} ${application.projectName} - ${application.position} ！` + this.application_message,
          "1",
          '0',
          '0',
          this.currentUser.id
        ).then(res => {
          if (res['result'] === 'successful') {
            this.application_message = this.defual_application_message;
          }
        })
      } else {
        this.toastSrv.showToast('Failed',
          this.toastSrv.applysendfailed,
          this.toastSrv.iconClasses.error);
      }
    }).catch(error => {
      this.toastSrv.showToast('Failed',
        this.toastSrv.applysendfailed,
        this.toastSrv.iconClasses.error);
    })
    this.closebutton.nativeElement.click();
  }

}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
