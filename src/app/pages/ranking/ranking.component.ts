import {
  Component,
  QueryList,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {

} from "../../_services";
import { NgbdSortableHeader, SortEvent } from '../../_directive';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import {
  AuthStore
} from "../../_services/auth.store";
@Component({
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.scss"]
})
export class RankingComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  currentTab: string = "projects";
  currentUser;

  projects$: Observable<any[]>;
  recruit$: Observable<any[]>;
  members$: Observable<any[]>;
  mentors$: Observable<any[]>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(

  ) {

  }

  ngOnInit() {

  }

  changeTab(tab) {
    this.currentTab = tab;
  }
}
