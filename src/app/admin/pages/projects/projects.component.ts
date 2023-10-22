import {
  Component, OnInit,
} from '@angular/core';
import { ProjectService, ToastService } from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-admin-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
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
export class AdminProjectsComponent implements OnInit {

  items: Array<any> = [];
  displayItems: Array<any> = [];
  isLoading = true;
  currentUser
  searchName = '';

  constructor(
    private toastSrv: ToastService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore,
  ) { }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.getAll();

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event

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

  getAll() {
    this.projectSrv.getall().subscribe(res => {

      this.items = res['data'];
      this.displayItems = this.items;
    }, error => {
      console.error("Get all users failed :", error);
    }, () => {
      this.isLoading = false;
    });
  }




  deleteUser(id, name) {
    try {
      this.projectSrv.delete(id, this.currentUser.id).then(res => {
        if (res["result"] == "successful") {
          this.getAll();
          this.toastSrv.showToast("",
            "delete " + name,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast("",
            res['message'],
            this.toastSrv.iconClasses.error);
        }
      })
    } catch (error) {
      console.error('delete user failed', error);
      this.toastSrv.showToast("",
        error.message,
        this.toastSrv.iconClasses.error);
    }
  }


}
