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
  RankingService
} from "../../_services";

import { Observable } from 'rxjs';

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

  projects = [];
  recruit = [];
  members = [];
  mentors = [];



  constructor(
    private rankingSrv: RankingService
  ) {

  }

  ngOnInit() {
    this.rankingSrv.getRanking().subscribe(res => {
      console.log("project ========", res)
      if (res['result'] == 'successful') {
        this.projects = res['projects'];
        this.members = res['users'];
        this.mentors = res['mentors'];
        this.recruit = res['recruit'];
      }
    })

  }

  changeTab(tab) {
    this.currentTab = tab;
  }
}
