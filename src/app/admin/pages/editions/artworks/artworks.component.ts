import {
  Component, OnInit,
  ViewChild,
  HostListener,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { UserService, ArtWorkService } from '../../../../_services';
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

import {
  ActivatedRoute
} from "@angular/router";
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
  artworks: Array<any> = [];
  displayArtworks: Array<any> = [];
  isLoading = false;;

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
    private route: ActivatedRoute,
    private artworkSrv: ArtWorkService,
    private userSrv: UserService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.filterPanelOpen = 'out';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
    };

    try {
      this.route.params.subscribe(params => {
        const _editionId = params["editionId"];
        this.artworkSrv.getArtwrokByEditionId(_editionId).subscribe(res => {
          console.log("res ===========", res);
          if (res["result"] === "successful") {
            this.artworks = res["data"];
            this.displayArtworks = this.artworks;
            //tags: "bizarre,love,romantic"
          } else {
            this.displayArtworks = this.artworks;
            //tags: "bizarre,love,romantic"
          }
        }, error => {
          console.error(` res error : ${error} `);
        }, () => {
          this.isLoading = false;
        });

      })

    } catch (error) {
      console.error(` res error : ${error} `);
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



}
