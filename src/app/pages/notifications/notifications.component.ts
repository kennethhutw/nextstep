import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DialogService } from './../../_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var $: any; // ADD THIS


@Component({
  selector: 'app-my-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications = [{
    type: "Notification",
    content: "有人注視妳"
  },
  {
    type: "Announcement",
    content: "新活動發布"
  },
  {
    type: "Announcement",
    content: "Next 有新功能喔!!"
  }]

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService) {
  }

  ngOnInit() {
    $('[data-toggle="popover"]').popover();


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
