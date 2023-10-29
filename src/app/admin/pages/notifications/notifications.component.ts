import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(public toasterSrv: ToastrService) { }

  ngOnInit() {
  }

  showSuccess() {
    this.toasterSrv.success('This is a success toastr message!', 'Success');
  }
  showInfo() {
    this.toasterSrv.info('This is an info toastr message!', 'Info');
  }
  showWarning() {
    this.toasterSrv.warning('This is a warning toastr message!', 'Warning');
  }
  showError() {
    this.toasterSrv.error('This is an error toastr message!', 'Error');
  }
  showToastr(positionClass) {
    this.toasterSrv.info('Hello world!', 'Toastr fun!', {
      positionClass
    });
  }

}
