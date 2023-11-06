import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RankingService
} from "../../_services";




import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"]
})
export class SubscriptionComponent implements OnInit {


  constructor(
    private rankingSrv: RankingService
  ) {

  }

  ngOnInit() {
    this.rankingSrv.getRanking().subscribe(res => {
      if (res['result'] == 'successful') {

      }
    })

  }


}
