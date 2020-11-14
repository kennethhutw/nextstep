import { Component, Inject } from "@angular/core";

import {  BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.css"]
})
export class ErrorDialogComponent {
    title: string;
    closeBtnName: string;
    list: any[] = [];
    status: number;
    message: string;
    constructor(public bsModalRef: BsModalRef) {}
 
    ngOnInit() {
      this.message="No Error";
    }
}