import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {

} from "../../_services";
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


  currentUser;

  constructor(

  ) {

  }

  ngOnInit() {

  }


}
