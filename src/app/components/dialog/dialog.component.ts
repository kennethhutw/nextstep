import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from './../../_services/dialog.service';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [
    './dialog.component.scss',
  ]
})

export class DialogComponent implements OnInit {
  message: any;
  title: string;
  msg: string;

  constructor(
    private translateSrv: TranslateService,
    private dialogSrv: DialogService
  ) { }

  ngOnInit(): any {
    /**
     *   This function waits for a message from alert service, it gets
     *   triggered when we call this from any other component
     */
    this.dialogSrv.getMessage().subscribe(message => {
      if (!!message) {
        this.msg = message.text.replace(/(\r\n|\n|\r)/gm, '<br>');
      }
      this.message = message;
    });

    this.dialogSrv.getTitle().subscribe(title => {
      if (!!title) {
        this.msg = title.text.replace(/(\r\n|\n|\r)/gm, '<br>');
      }
      this.message = title;
    });
  }

}
