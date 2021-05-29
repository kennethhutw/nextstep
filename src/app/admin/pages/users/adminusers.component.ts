import {
  Component, OnInit,
  ViewChild,
  HostListener,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { UserService, ToastService } from '../../../_services';
import { DataTableDirective } from 'angular-datatables';
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
  styleUrls: ['./adminusers.component.css'],
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

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  users: Array<any> = [];
  displayUsers: Array<any> = [];
  isLoading = true;

  dtTrigger: Subject<any> = new Subject();

  dtOptions: DataTables.Settings = {};
  datepickerConfig = {
    containerClass: 'theme-default',
    isAnimated: true,
    adaptivePosition: true,
    showWeekNumbers: false,
    showPreviousMonth: true,
    returnFocusToInput: true
  };

  sendEmail = '';
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
    private userSrv: UserService
  ) { }

  ngOnInit() {
    this.filterPanelOpen = 'out';
    this.getAllUser();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  rerender(): void {
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 2,
        };
        this.getAllUser();
        //  dtInstance.draw();
      });
    }
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
      this.userSrv.deleteUser(id).subscribe(res => {
        if (res["result"] == "successful") {
          this.getAllUser();
          this.toastSrv.showToast('Success',
            "delete " + name,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            res['message'],
            this.toastSrv.iconClasses.error);
        }
      })
    } catch (error) {
      console.error('delete user failed', error);
      this.toastSrv.showToast('Failed',
        error.message,
        this.toastSrv.iconClasses.error);
    }
  }
}
