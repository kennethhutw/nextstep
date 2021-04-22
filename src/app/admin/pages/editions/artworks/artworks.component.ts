import {
  Component, OnInit,
  ViewChild,
  HostListener,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { UserService, EditionService } from '../../../../_services';
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
  selector: 'app-admin-artworks',
  templateUrl: './artworks.component.html',
  styleUrls: ['./artworks.component.css'],
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
export class AdminArtworkComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  atrworks: Array<any> = [];
  displayArtworks: Array<any> = [];
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
    private editionSrv: EditionService,
    private userSrv: UserService
  ) { }

  ngOnInit() {
    this.filterPanelOpen = 'out';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
    };

    try {
      // this.editionSrv.getTokenizeEdition(id).subscribe(res => {
      //   console.log(` getEdition ${res}`, res);
      //   if (res['result'] == 'successful') {
      //     this.atrworks = res['data'];
      //     this.displayArtworks = this.atrworks;

      //   }
      // }, error => {
      //   console.error(` get initEdition : ${error} `);

      // })
    } catch (error) {

    }
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
    this.editionSrv.getEditions().subscribe(res => {
      console.log("getEditions ========", res);
      this.atrworks = res['data'];
      this.displayArtworks = this.atrworks;
    }, error => {
      console.error("Get all editions failed :", error);
    }, () => {
      this.isLoading = false;
    });
  }



}
