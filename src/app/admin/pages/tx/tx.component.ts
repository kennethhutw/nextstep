import {
  Component, OnInit,
  ViewChild,
  HostListener,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { TxService, ToastService } from '../../../_services';
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
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
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
export class TransactionComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  items: Array<any> = [];
  displayItems: Array<any> = [];
  isLoading = true;

  dtTrigger: Subject<any> = new Subject();

  dtOptions: DataTables.Settings = {};
  currentArtworkURL = "";

  datepickerConfig = {
    containerClass: 'theme-default',
    isAnimated: true,
    adaptivePosition: true,
    showWeekNumbers: false,
    showPreviousMonth: true,
    returnFocusToInput: true
  };



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
    private changeDetectorRef: ChangeDetectorRef,
    private toastSrv: ToastService,
    private txSrv: TxService
  ) { }

  ngOnInit() {
    this.getTxs();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[7, 'desc']]
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
          order: [[7, 'desc']]
        };
        this.getTxs();
        //  dtInstance.draw();
      });
    }
  }


  getTxs() {
    this.txSrv.getTxs().subscribe(res => {
      console.log("====================", res);
      this.items = res['data'];
      this.items.forEach((element) => {
        if (element.imageUrl != null) {
          element.imageUrl = environment.assetUrl + element.imageUrl;
        }
        if (element.thumbnail != null) {
          element.thumbnail = environment.assetUrl + element.thumbnail;
        }
      });
      this.displayItems = this.items;
    }, error => {
      console.error("Get getTxs failed :", error);
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

  viewImage(path) {

    this.currentArtworkURL = path;
    this.changeDetectorRef.detectChanges();
    document.getElementById('openViewImgModalButton').click();
  }
}
