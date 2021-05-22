import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  DataService,
  OfferService,
  AuthStore,
  EditionService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { environment } from '../../../../environments/environment';

@Component({
  selector: "app-collector-offer",
  templateUrl: "./collector-offer.component.html",
  styleUrls: ["./collector-offer.component.css"],
})
export class CollectorOfferComponent implements OnInit {
  currentUser: any;
  bids = [];
  ethPrice = 0;
  searchText = "";
  constructor(private translateSrv: TranslateService,
    private utility: Utility,
    private editionSrv: EditionService,
    private dataSrv: DataService,
    private offerSrv: OfferService,
    private authStoreSrv: AuthStore) { }

  ngOnInit() {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

    this.currentUser = this.authStoreSrv.getUserData();
    this.offerSrv.getBidArtWork(this.currentUser.id).subscribe(res => {
      console.log(" getbidArtwork", res);
      if (res['result'] === 'successful') {
        if (res['data'] != null) {
          this.bids = res['data'];
          this.bids.forEach((element) => {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          });
        }
      }
      else {
        this.bids = [];
      }
    }, error => {
      console.error(`getArtwrokByArtistId failed `, error);
    });

  }


}
