import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RankingService
} from "../../_services";

import { Observable } from 'rxjs';

import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

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
    private rankingSrv: RankingService,
    private spinnerSrv: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.spinnerSrv.show();
    this.rankingSrv.getRanking().subscribe(res => {
      if (res['result'] == 'successful') {
        this.projects = res['projects'];
        this.members = res['users'];
        this.mentors = res['mentors'];
        this.recruit = res['recruit'];
      }
    }, err => console.log('Ranking Error', err),
      () => { this.spinnerSrv.hide(); })

  }

  changeTab(tab) {
    this.currentTab = tab;
  }
}
