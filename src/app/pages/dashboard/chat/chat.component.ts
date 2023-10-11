import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService, ChatService,
  SettingService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { AuthStore } from "src/app/_services/auth.store";
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {

  items = [];
  selectedItem = null;
  searchText = '';
  message = '';
  sendDisabeld: boolean = true;
  currentUser;
  loading = true;
  constructor(
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private chatSrv: ChatService,
    private authStoreSrv: AuthStore,
    public settingSrv: SettingService,
    private spinnerSrv: NgxSpinnerService
  ) {

    this.currentUser = this.authStoreSrv.getUserData();
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {
    if (this.currentUser) {
      this.initChat(this.currentUser.id);
    }
  }

  initChat(uid) {
    this.spinnerSrv.show();

    this.chatSrv.getConversations(uid).then(res => {

      if (res["result"] == "successful") {
        if (res["data"]) {
          this.items = res["data"];
          if (this.items.length > 0) {
            this.selectedItem = this.items[0];
          }
        }
      }
      this.loading = false;
      this.spinnerSrv.hide();
    }).catch(error => {
      console.log("init chat error", error);
      this.spinnerSrv.hide();
      this.loading = false;
    })
  }

  onClick(item) {
    let index = this.items.findIndex((obj => obj.userId == item.userId));
    if (index > -1) {
      this.items[index].readNum = 0;
      this.items[index].chat = this.items[index].chat.sort((a, b) => a.createdAt - b.createdAt);
      this.selectedItem = this.items[index];
    }
    this.updateRead(this.currentUser.id, item.userId);
  }

  updateRead(uid, to_uid) {
    try {
      this.chatSrv.read(uid, to_uid).subscribe(res => {
        console.log("update read", res);
        if (res["result"] === "successful") {

        }
      }, error => {
        console.log("updateRead error", error);
      })
    }
    catch (error) {
      console.log(" updateRead error", error);
    }
  }

  onChange(event: any) {
    this.message = event.target.value;
    this.sendDisabeld = this.message.length > 0;
  }

  onSendMsg() {
    this.chatSrv.insert({
      sender: this.currentUser.id,
      sender_name: this.currentUser.name,
      receiver: this.selectedItem.userId,
      receiver_name: this.selectedItem.name,
      content: this.message,
      type: "0",
      status: "0",
      readAt: null
    }).subscribe(res => {
      if (res['result'] === 'successful') {
        let index = this.items.findIndex((obj => obj.userId == this.selectedItem.userId));
        this.items[index].chat.push({
          content: this.message,
          createdAt: moment.utc().valueOf(),
          createdBy: this.currentUser.id,
          id: null,
          readAt: null,
          receiver: this.selectedItem.userId,
          receiverImageUrl: null,
          receiverName: this.selectedItem.name,
          sender: this.currentUser.id,
          senderImageUrl: "/assets/uploads/profile/file-1660048060134.jpg",
          senderName: "kenneth",
          status: 0,
          type: "0",
          updatedAt: moment.utc().valueOf(),
          updatedBy: this.currentUser.id,
        });
        // this.selectedItem.chat.push({
        //   content: this.message,
        //   createdAt: moment.utc().valueOf(),
        //   createdBy: this.currentUser.id,
        //   id: null,
        //   readAt: null,
        //   receiver: this.selectedItem.userId,
        //   receiverImageUrl: null,
        //   receiverName: this.selectedItem.name,
        //   sender: this.currentUser.id,
        //   senderImageUrl: "/assets/uploads/profile/file-1660048060134.jpg",
        //   senderName: "kenneth",
        //   status: 0,
        //   type: "0",
        //   updatedAt: moment.utc().valueOf(),
        //   updatedBy: this.currentUser.id,
        // });
        this.message = "";

      } else {

      }

    }, (error) => {
      console.error("saveError", error);

    })
  }

  onImgError(event) {
    event.target.src = this.settingSrv.defaultUserLogo;
  }

}
