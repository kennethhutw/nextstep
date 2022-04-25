import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {

  ProjectService,
  DataService,
  AppSettingsService,
  LikeService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-findproject",
  templateUrl: "./findproject.component.html",
  styleUrls: ["./findproject.component.css"]
})
export class FindProjectComponent implements OnInit {
  items: any[] = [];
  displayItems = [];
  currentUser;
  filterCondition = {
    sideproject: true,
    fullproject: true,
    websit: true,
    app: true,
    hardware: true,
    eComm: true,
    ai: true,
    edutech: true,
    sharingeconomy: true,
    medical: true,
    transport: true,
    fintech: true,
    game: true,
    work12: true,
    work34: true,
    work56: true,
    work78: true,
    work9: true

  }
  constructor(
    private projectSrv: ProjectService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStore: AuthStore,
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
    this.projectSrv.getPublicProjects(_id).then(res => {

      if (res['result'] == 'successful') {
        this.items = res['data'];
        this.displayItems = this.items ? this.items : [];
      }
      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })

    this.translateSrv.use("zh-tw");
    //this.displayItems = this.items;
    //this.SpinnerService.hide();
  }



  onCollect($event) {
    if ($event.isCollect) {
      this.likeSrv.like(this.currentUser.id, $event.projectId, 'project').subscribe(res => {
        if (res['result'] == 'successful') {

        }
      })
    } else {
      this.likeSrv.removeLike(this.currentUser.id, $event.projectId, 'project').subscribe(res => {
        if (res['result'] == 'successful') {

        }
      })
    }
  }

  onfilter(value) {


  }

  onProjectChange(event) {

    if (this.filterCondition.sideproject && this.filterCondition.fullproject) {
      this.displayItems = this.items;
    } else if (!this.filterCondition.sideproject && this.filterCondition.fullproject) {

      this.displayItems = this.items.filter(item => {
        return item.isSideProject == 0
      })
    } else if (this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = this.items.filter(item => {
        return item.isSideProject == 1
      })

    } else if (!this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = [];
    }
    if (this.displayItems.length > 0)
      this.checkWorkTime(this.displayItems)
    if (this.displayItems.length > 0)
      this.checkType(this.displayItems)
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
      this.filterCondition.transport &&
      this.filterCondition.fintech &&
      this.filterCondition.game) {
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

    if (this.displayItems.length > 0)
      this.checkProject(this.displayItems)
    if (this.displayItems.length > 0)
      this.checkWorkTime(this.displayItems)
  }

  onProductChange(event) {

  }

  onClearFilter() {
    this.displayItems = this.items;
  }

  checkProject(items) {
    if (this.filterCondition.sideproject && this.filterCondition.fullproject) {
      this.displayItems = items;
    } else if (!this.filterCondition.sideproject && this.filterCondition.fullproject) {

      this.displayItems = items.filter(item => {
        return item.isSideProject == 0
      })
    } else if (this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = items.filter(item => {
        return item.isSideProject == 1
      })

    } else if (!this.filterCondition.sideproject && !this.filterCondition.fullproject) {
      this.displayItems = [];
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
}
