import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: "app-loading-dialog",
  templateUrl: "./loading-dialog.component.html",
  styleUrls: ["./loading-dialog.component.css"]
})
export class LoadingDialogComponent {
  constructor(public bsModalRef: BsModalRef) {}
}