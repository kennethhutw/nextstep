import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: "app-artist-edition-detail",
  templateUrl: "./artist-edition-detail.component.html",
  styleUrls: ["./artist-edition-detail.component.css"],
})
export class ArtistEditionDetailComponent implements OnInit {

  constructor(
       private router: Router,
    private route: ActivatedRoute,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService) {

    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
      console.log(" =======================",params);
      // var walletPromise = this.walletSrv.getWalletByUid(uid);
      // console.log("helppp", walletPromise);
      // for (let i in walletPromise) {
      //   this.wallets.push(walletPromise[i])
      // }
      // console.log("wallettsss", this.wallets);
    });
  }


}
