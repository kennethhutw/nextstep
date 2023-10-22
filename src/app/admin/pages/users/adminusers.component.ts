import {
  Component, OnInit,
  ViewChild,
  HostListener
} from '@angular/core';
import {
  UserService,
  ToastService,
  ConfirmDialogService
} from '../../../_services';
import { Subject } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '*',
        width: '100%'
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '0px'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class AdminUsersComponent implements OnInit {


  users: Array<any> = [];
  displayUsers: Array<any> = [];
  isLoading = true;

  dtTrigger: Subject<any> = new Subject();


  datepickerConfig = {
    containerClass: 'theme-default',
    isAnimated: true,
    adaptivePosition: true,
    showWeekNumbers: false,
    showPreviousMonth: true,
    returnFocusToInput: true
  };

  sendEmail = '';
  searchUserName = '';
  // fiter
  filterPanelOpen: string;
  FromDate: string;
  ToDate: string;
  @ViewChild(BsDaterangepickerDirective) datepicker: BsDaterangepickerDirective;

  @HostListener('window:scroll')
  onScrollEvent() {
    if (!!this.datepicker) {
      if (this.datepicker.isOpen) {
        this.datepicker.hide();
      }
    }
  }

  constructor(
    private toastSrv: ToastService,
    private userSrv: UserService,
    private confirmDialogSrv: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.filterPanelOpen = 'out';
    this.getAllUser();

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  rerender(): void {

  }

  getVerified(verified: number): string {
    if (verified === 1) {
      return 'Verified';
    } else {
      return 'No';
    }
  }

  getAdmin(IsAdmin: boolean): string {
    if (IsAdmin === true) {
      return 'Admin';
    }
  }
  getAllUser() {
    this.userSrv.getAllUser().subscribe(res => {

      this.users = res['data'];
      this.displayUsers = this.users;
    }, error => {
      console.error("Get all users failed :", error);
    }, () => {
      this.isLoading = false;
    });
  }


  DisplayRoles(roles) {
    let _role = "";
    if (roles.admin) {
      _role += "admin, ";
    }
    if (roles.artist) {
      _role += "artist, ";
    }
    if (roles.collector) {
      _role += "collector, ";
    }
    return _role;
  }

  deleteUser(id, name) {
    try {

      this.confirmDialogSrv.confirmThis("確認要刪除此成員", () => {
        this.userSrv.deleteUser(id).subscribe(res => {
          if (res["result"] == "successful") {
            this.getAllUser();
            this.toastSrv.showToast('',
              "delete " + name,
              this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('',
              res['message'],
              this.toastSrv.iconClasses.error);
          }
        })

      }, () => {

      })

    } catch (error) {
      console.error('delete user failed', error);
      this.toastSrv.showToast('',
        error.message,
        this.toastSrv.iconClasses.error);
    }
  }

  onChange(value) {
    if (value !== "") {
      this.displayUsers = this.users.filter(user => {
        if (value == 'admin' && user.roles.admin) {
          return true;
        } else if (value == 'artist' && user.roles.artist) {
          return true;
        } else if (value == 'collector' && user.roles.collector) {
          return true;
        }
      });
    } else {
      this.displayUsers = this.users;
    }
  }
}
