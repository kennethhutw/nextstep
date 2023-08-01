import { HostListener, ViewEncapsulation, Component, OnInit } from '@angular/core';
import {
  PagerService,
  DialogService,
  NotificationService,
  DataService
} from './../../../_services';
import { Utility } from "../../../_helpers";
import { TranslateService } from "@ngx-translate/core";
import { AuthStore } from './../../../_services/auth.store';
@Component({
  selector: 'app-my-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {

  notifications: any[] = [];
  currentPageIndex: number = 1;

  currentUser: any;
  constructor(
    private pagerSrv: PagerService,
    private notificationSrv: NotificationService,
    private dialogSrv: DialogService,
    private authStore: AuthStore) {
  }

  ngOnInit() {

    this.currentUser = this.authStore.getUserData();
    this.notificationSrv.getNotifications(this.currentUser.id).then(res => {
      if (res['result'] == 'successful') {
        this.notifications = res['data'];
      } else {
        this.notifications = [];
      }
    }).catch(error => {
      console.error("notificaiton error", error);
    })

    this.notificationSrv.allread(this.currentUser.id).subscribe(res => {

      if (res['result'] == 'successful') {

      } else {

      }
    }, error => {
      console.error("allread error", error);
    })

  }

  try() {
    this.dialogSrv.confirmThis("you have successfully registered ",
      () => {
        console.log("yed ===");
      }, () => {
        console.log("No ----");
      });
  }

  onPageChange(event) {
    console.log("onPageChange ===", event.page)
    this.currentPageIndex = event.page;
  }
  // Pagination
  onPage(i) {

    let _num = this.pagerSrv.Page(i, this.currentPageIndex, 10);
    return _num;
  }

  onReadAll() {
    this.notificationSrv.allread(this.currentUser.id).subscribe(res => {

      if (res['result'] == 'successful') {

      } else {

      }
    }, error => {
      console.error("allread error", error);
    })
  }
}
