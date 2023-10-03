import {
  Component, OnInit, Input, Output,
  ChangeDetectorRef,
  ViewEncapsulation,
  EventEmitter
} from "@angular/core";
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  Utility
} from './../../_helpers';
export interface IlinkPreview {
  description: string;
  image: string;
  title: string;
  url: string;
}


@Component({
  selector: "app-jobCard",
  templateUrl: "./jobCard.component.html",
  styleUrls: ["./jobCard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class JobCardComponent implements OnInit {

  _item = null;
  @Input() item;
  @Input() currentProject;
  @Input() currentUser;

  @Output() ClickJobCollect = new EventEmitter<any>();
  @Output() ModifyJobItem = new EventEmitter<any>();
  @Output() DeleteJobItem = new EventEmitter<any>();
  @Output() SelectItem = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private utilitySrv: Utility,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {

  }

  onImgError(event) {
    event.target.src = "assets/images/defaultProjectIcon.png";
  }

  onClickJobCollect(recruitId, isCollected) {
    this.ClickJobCollect.emit({ recruitId, isCollected });
  }

  onSelectItem(item) {
    this.SelectItem.emit(item);
  }

  onModifyJobItem(item) {
    this.ModifyJobItem.emit(item);
  }

  onDeleteJobItem(item) {
    this.DeleteJobItem.emit(item);
  }
}
