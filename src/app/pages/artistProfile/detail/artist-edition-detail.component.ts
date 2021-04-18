import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  EditionService,
  SettingService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../../../environments/environment';

@Component({
  selector: "app-artist-edition-detail",
  templateUrl: "./artist-edition-detail.component.html",
  styleUrls: ["./artist-edition-detail.component.css"],
})
export class ArtistEditionDetailComponent implements OnInit {

  artwork = null;
  defaultProfileLogo = null;
  ethPrice = 0;
  constructor(
    private router: Router,
    private settingSrv: SettingService,
    private editionSrv: EditionService,
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
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
    const id = this.route.snapshot.paramMap.get("id");
    if (!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE"))) {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }
    this.editionSrv.getEditionById(id).subscribe(res => {

      if (res['result'] === 'successful') {
        const _data = res['data'];
        if (!this.utility.IsNullOrEmpty(_data.imageUrl)) {
          _data.imageUrl = environment.assetUrl + _data.imageUrl;
        }
        this.artwork = _data;
      }
      else {

      }
    }, err => {
      console.error(`getArtwrokById failed ${err}`);
    });

  }

  getSellETHPrice(usdvalue) {
    return this.utility.getSellETHPrice(usdvalue);
  }

  getImageStatus(status) {
    switch (status) {
      case "0":
        return "審核中";

      case "1":
        return "上架中";

      case "2":
        return "已上架";

      case "3":
        return "競價中";

      case "4":
        return "已下架";

    }
  }

  IsBidding(value) {
    switch (value) {
      case "0":
      case 0:
        return "No";

      case "1":
      case 1:
        return "Yes";

    }
  }
}
