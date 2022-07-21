import { HostListener, ViewEncapsulation, Component, OnInit } from '@angular/core';
import { DialogService, NotificationService, } from './../../../_services';
import { AuthStore } from './../../../_services/auth.store';
@Component({
  selector: 'app-my-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {

  // notifications = [{
  //   type: "Notification",
  //   content: "有人注視妳",
  //   time: "1642506026"
  // },
  // {
  //   type: "Announcement",
  //   content: "新活動發布",
  //   time: "1642505026"
  // },
  // {
  //   type: "Announcement",
  //   content: "Next 有新功能喔!!",
  //   time: "1642541026"
  // }]
  // }]
  notifications: any[] = [];

  currentUser: any;
  constructor(
    private notificationSrv: NotificationService,
    private dialogSrv: DialogService,
    private authStore: AuthStore) {
  }

  ngOnInit() {

    this.currentUser = this.authStore.getUserData();
    this.notificationSrv.getNotifications(this.currentUser.id).then(res => {
      console.log("=========", res);
      if (res['result'] == 'successful') {
        this.notifications = res['data'];
      } else {
        this.notifications = [];
      }
    }).catch(error => {
      console.error("notificaiton error", error);
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

}
