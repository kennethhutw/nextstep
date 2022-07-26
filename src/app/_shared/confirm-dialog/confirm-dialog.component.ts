import { Component, Input, OnInit } from '@angular/core';
import { ConfirmDialogService } from '../../_services';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: [
    './confirm-dialog.component.scss',
  ]
})

export class ConfirmDialogComponent implements OnInit {
  message: any;
  msg: string;

  constructor(
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit(): any {
    /**
     *   This function waits for a message from alert service, it gets
     *   triggered when we call this from any other component
     */
    this.confirmDialogService.getMessage().subscribe(message => {
      console.log("===========", message)
      if (!!message) {
        this.msg = message.text.replace(/(\r\n|\n|\r)/gm, '<br>');
      }
      this.message = message;
    });
  }
}
