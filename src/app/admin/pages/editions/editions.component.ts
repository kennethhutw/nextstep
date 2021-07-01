import {
  Component, OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import {
  UserService, EditionService,
  SettingService
} from '../../../_services';
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
import { environment } from './../../../../environments/environment';
@Component({
  selector: 'app-admin-editions',
  templateUrl: './editions.component.html',
  styleUrls: ['./editions.component.css'],
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
export class AdminEditionComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  editions: Array<any> = [];
  displayEditions: Array<any> = [];
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
  defaultProfileLogo = null;
  @ViewChild(BsDaterangepickerDirective) datepicker: BsDaterangepickerDirective;

  @HostListener('window:scroll')
  onScrollEvent() {
    if (!!this.datepicker) {
      if (this.datepicker.isOpen) {
        this.datepicker.hide();
      }
    }
  }

  currentArtworkURL = "";
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private settingSrv: SettingService,
    private editionSrv: EditionService,
    private userSrv: UserService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {
    this.filterPanelOpen = 'out';
    this.getAllEdition();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
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
          pageLength: 12,
        };
        this.getAllEdition();
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
  getAllEdition() {
    this.editionSrv.getEditions().subscribe(res => {
      this.editions = res['data'];
      this.editions.forEach((element) => {
        if (element.imageUrl != null) {
          element.imageUrl = environment.assetUrl + element.imageUrl;
        }
        if (element.thumbnail != null) {
          element.thumbnail = environment.assetUrl + element.thumbnail;
        }
      });
      this.displayEditions = this.editions;
    }, error => {
      console.error("Get all editions failed :", error);
    }, () => {
      this.isLoading = false;
    });
  }


  viewImage(path) {

    this.currentArtworkURL = path;
    this.changeDetectorRef.detectChanges();
    document.getElementById('openViewImgModalButton').click();
  }

}
