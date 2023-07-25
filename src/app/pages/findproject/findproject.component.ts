import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ViewsService,
  ProjectService,
  ToastService,
  NotificationService,
  DataService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-findproject",
  templateUrl: "./findproject.component.html",
  styleUrls: ["./findproject.component.scss"]
})
export class FindProjectComponent implements OnInit {
  items: any[] = [];
  displayItems = [];
  foundItemNum: number = -1;
  currentUser;
  isInit: boolean = true;
  filterCondition = {
    isFindPartner: false,
    isFunding: false,
    isCofounder: false,
    sideproject: false,
    fullproject: false,
    websit: false,
    app: false,
    hardware: false,
    eComm: false,
    ai: false,
    edutech: false,
    sharingeconomy: false,
    medical: false,
    transport: false,
    fintech: false,
    game: false,
    work12: false,
    work34: false,
    work56: false,
    work78: false,
    work9: false
  }

  msg = {
    startfollow: "開始追蹤",
    stopfollow: "停止追蹤",
    collectla: "收藏了",
    uncollectla: "取消收藏"
  }
  constructor(
    private projectSrv: ProjectService,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private viewsSrv: ViewsService,
    private authStore: AuthStore,
    private SpinnerService: NgxSpinnerService,
    public toastSrv: ToastService,
    private dataSrv: DataService,
    private notificationSrv: NotificationService,
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
    this.projectSrv.getPublicProjects(_id).then(res => {

      if (res['result'] == 'successful') {
        this.items = res['data'];
        this.displayItems = this.items ? this.items : [];

      }
      this.SpinnerService.hide();
      this.isInit = false;
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
      this.isInit = false;
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
  }

  onProjectStatusChange(event) {

    if (!this.filterCondition.isFindPartner &&
      !this.filterCondition.isFunding &&
      !this.filterCondition.isCofounder) {
      this.displayItems = this.items;
      this.foundItemNum = -1;
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.isFindPartner
          && item.isFindPartner) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.isFunding
          && item.isFunding) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.isCofounder && item.isCofounder) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }

        this.displayItems = currentItem;
        if (this.displayItems.length == 0 || this.displayItems.length == this.items.length) {
          this.foundItemNum = -1;
        } else {
          this.foundItemNum = this.displayItems.length;
        }


      })

    }
  }

  onProjectChange(event) {
    if (this.filterCondition.sideproject && this.filterCondition.fullproject) {
      this.displayItems = this.items;
    } else if (this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = this.items.filter(item => {
        return item.isSideProject == 1 && item.isFullproject == 0
      })
    } else if (!this.filterCondition.sideproject && this.filterCondition.fullproject) {
      this.displayItems = this.items.filter(item => {
        return item.isFullproject == 1 && item.isSideProject == 0
      })
    } else if (!this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = [];
    }
    /*   if (this.displayItems.length > 0)
        this.checkWorkTime(this.displayItems)
      if (this.displayItems.length > 0)
        this.checkType(this.displayItems) */
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

    if (this.displayItems.length > 0)
      this.checkProject(this.displayItems)
    if (this.displayItems.length > 0)
      this.checkType(this.displayItems)
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

  onTypeChange(event) {

    if (this.filterCondition.eComm &&
      this.filterCondition.ai &&
      this.filterCondition.edutech &&
      this.filterCondition.sharingeconomy &&
      this.filterCondition.medical &&
      this.filterCondition.transport &&
      this.filterCondition.fintech &&
      this.filterCondition.game) {
      this.displayItems = this.items;
    } else if (!this.filterCondition.eComm &&
      !this.filterCondition.ai &&
      !this.filterCondition.edutech &&
      !this.filterCondition.sharingeconomy &&
      !this.filterCondition.medical &&
      !this.filterCondition.transport &&
      !this.filterCondition.fintech &&
      !this.filterCondition.game) {
      this.displayItems = [];
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.eComm &&
          item.type.includes('eComm')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.ai &&
          item.type.includes('ai')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.edutech &&
          item.type.includes('edutech')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.sharingeconomy &&
          item.type.includes('sharingeconomy')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.medical &&
          item.type.includes('medical')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.transport &&
          item.type.includes('transport')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.fintech &&
          item.type.includes('fintech')) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.game &&
          item.type.includes('game')) {
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
    //   this.checkWorkTime(this.displayItems)
    this.finalCheck();
  }

  onProductChange(event) {

  }

  finalCheck() {
    if (
      this.filterCondition.eComm &&
      this.filterCondition.ai &&
      this.filterCondition.edutech &&
      this.filterCondition.sharingeconomy &&
      this.filterCondition.medical &&
      this.filterCondition.transport &&
      this.filterCondition.fintech &&
      this.filterCondition.game &&
      this.filterCondition.sideproject &&
      this.filterCondition.fullproject &&
      this.filterCondition.work12 &&
      this.filterCondition.work34 &&
      this.filterCondition.work56 &&
      this.filterCondition.work78 &&
      this.filterCondition.work9) {
      this.displayItems = this.items;;
    } else if (
      !this.filterCondition.eComm &&
      !this.filterCondition.ai &&
      !this.filterCondition.edutech &&
      !this.filterCondition.sharingeconomy &&
      !this.filterCondition.medical &&
      !this.filterCondition.transport &&
      !this.filterCondition.fintech &&
      !this.filterCondition.game &&
      !this.filterCondition.sideproject &&
      !this.filterCondition.fullproject &&
      !this.filterCondition.work12 &&
      !this.filterCondition.work34 &&
      !this.filterCondition.work56 &&
      !this.filterCondition.work78 &&
      !this.filterCondition.work9) {
      this.displayItems = this.items;
    }

    if (this.displayItems.length == 0 || this.displayItems.length == this.items.length) {
      this.foundItemNum = -1;
    } else {
      this.foundItemNum = this.displayItems.length;
    }
  }

  onClearFilter() {
    this.displayItems = this.items;
    this.foundItemNum = -1;
  }

  checkProjectStatus(items) {
    if (this.filterCondition.isFindPartner &&
      this.filterCondition.isFunding &&
      this.filterCondition.isCofounder) {
      this.displayItems = items;
    } else if (!this.filterCondition.isFindPartner &&
      !this.filterCondition.isFunding &&
      !this.filterCondition.isCofounder) {

      this.displayItems = items;
    } else {
      let currentItem = []
      this.items.map(item => {
        if (this.filterCondition.isFindPartner
          && item.isFindPartner) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.isFunding
          && item.isFunding) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        if (this.filterCondition.isCofounder && item.isCofounder) {
          if (!this.isExist(currentItem, item.id)) {
            currentItem.push(item);
          }
        }
        this.displayItems = currentItem;
      })

    }
  }

  checkProject(items) {
    if (this.filterCondition.sideproject && this.filterCondition.fullproject) {
      this.displayItems = items;
    } else if (this.filterCondition.sideproject && !this.filterCondition.fullproject) {

      this.displayItems = items.filter(item => {
        return item.isSideProject == 1 && item.isFullproject == 0
      })
    } else if (!this.filterCondition.sideproject && this.filterCondition.fullproject) {
      this.displayItems = items.filter(item => {
        return item.isFullproject == 1 && item.isSideProject == 0
      })

    } else if (!this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = items;
    }
  }

  checkWorkTime(items) {
    let currentItem = []

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

  checkType(items) {
    let currentItem = []
    items.map(item => {
      if (this.filterCondition.eComm &&
        item.type.includes('eComm')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.ai &&
        item.type.includes('ai')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.edutech &&
        item.type.includes('edutech')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.sharingeconomy &&
        item.type.includes('sharingeconomy')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.medical &&
        item.type.includes('medical')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.transport &&
        item.type.includes('transport')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.fintech &&
        item.type.includes('fintech')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
      if (this.filterCondition.game &&
        item.type.includes('game')) {
        if (!this.isExist(currentItem, item.id)) {
          currentItem.push(item);
        }
      }
    })
    this.displayItems = currentItem;

  }

  onCleanClick() {
    this.filterCondition.isCofounder = false;
    this.filterCondition.isFindPartner = false;
    this.filterCondition.isFunding = false;
    this.filterCondition.eComm = false;
    this.filterCondition.ai = false;
    this.filterCondition.edutech = false;
    this.filterCondition.sharingeconomy = false;
    this.filterCondition.medical = false;
    this.filterCondition.transport = false;
    this.filterCondition.fintech = false;
    this.filterCondition.game = false;
    this.filterCondition.sideproject = false;
    this.filterCondition.fullproject = false;
    this.filterCondition.work12 = false;
    this.filterCondition.work34 = false;
    this.filterCondition.work56 = false;
    this.filterCondition.work78 = false;
    this.filterCondition.work9 = false;
    this.displayItems = this.items;
    this.foundItemNum = -1;
  }


  onClickFollow(event) {
    this.viewsSrv.follow(
      event.projectId,
      this.notificationSrv.types.project,
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.projectId));
        this.items[_index].isFollow = true;
        this.notificationSrv.insert(
          this.items[_index].owner,
          this.currentUser.id,
          this.currentUser.name + this.msg.startfollow + this.items[_index].name,
          this.notificationSrv.types.project,
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastSrv.showToast('Success',
          this.toastSrv.followingStr + this.toastSrv.successfulStr,
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('Failed',
          this.toastSrv.followingStr + this.toastSrv.failedStr,
          this.toastSrv.iconClasses.error);
      }
    });
  }

  onClickUnFollow(event) {

    this.viewsSrv.unFollow(
      event.projectId,
      this.notificationSrv.types.project,
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.projectId));
        this.items[_index].isFollow = false;
        this.notificationSrv.insert(
          this.items[_index].owner,
          this.currentUser.id,
          this.currentUser.name + this.msg.stopfollow + this.items[_index].name,
          this.notificationSrv.types.project,
          0,
          0,
          this.currentUser.id
        ).then(res => { });
        this.toastSrv.showToast('Success',
          this.toastSrv.unfollowingStr + this.toastSrv.successfulStr,
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('Failed',
          this.toastSrv.unfollowingStr + this.toastSrv.failedStr,
          this.toastSrv.iconClasses.error);
      }
    });
  }

  onClickCollect(event) {

    this.viewsSrv.collect(
      event.projectId,
      this.notificationSrv.types.project,
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.projectId));
        this.items[_index].isCollect = true;
        this.notificationSrv.insert(
          this.items[_index].owner,
          this.currentUser.id,
          this.currentUser.name + this.msg.collectla + this.items[_index].name,
          this.notificationSrv.types.project,
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
      event.projectId,
      this.notificationSrv.types.project,
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let _index = this.items.findIndex((obj => obj.id == event.projectId));
        this.items[_index].isCollect = false;
        this.notificationSrv.insert(
          this.items[_index].owner,
          this.currentUser.id,
          this.currentUser.name + this.msg.uncollectla + this.items[_index].name,
          this.notificationSrv.types.project,
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
}
