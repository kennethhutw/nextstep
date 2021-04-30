import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  EditionService,
  SettingService,
  DialogService,
  ArtWorkService,
  AuthStore
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
  editionId = "";
  _lang = "en";
  currentUser: any;
  constructor(
    private dialogSrv: DialogService,
    private router: Router,
    private settingSrv: SettingService,
    private editionSrv: EditionService,
    private artworkSrv: ArtWorkService,
    private route: ActivatedRoute,
    private translateSrv: TranslateService,
    private utility: Utility,
    private authStoreSrv: AuthStore,
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

    this.currentUser = this.authStoreSrv.getUserData();

    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
    this.editionId = this.route.snapshot.paramMap.get("id");
    if (!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE"))) {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }
    this.editionSrv.getEditionById(this.editionId).subscribe(res => {

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


    this._lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(this._lang)) {
      this.translateSrv.use(this._lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this._lang = lang;
        this.translateSrv.use(lang);
      }
    });

  }

  getSellETHPrice(usdvalue) {
    return this.utility.getSellETHPrice(usdvalue);
  }

  getImageStatus(status) {
    let _status = "Review";
    switch (status) {
      case "0":
        if (this._lang == "en") {
          _status = "Review";
        } else if (this._lang == "zh-cn") {
          _status = "审核中";
        } else if (this._lang == "zh-tw") {
          _status = "審核中";
        }
        return _status;

      case "1":
        if (this._lang == "en") {
          _status = "Available";
        } else if (this._lang == "zh-cn") {
          _status = "已上架";
        } else if (this._lang == "zh-tw") {
          _status = "已上架";
        }
        return _status;


      case "2":
        if (this._lang == "en") {
          _status = "Auction";
        } else if (this._lang == "zh-cn") {
          _status = "竞价中";
        } else if (this._lang == "zh-tw") {
          _status = "競價中";
        }
        return _status;

      case "3":
        if (this._lang == "en") {
          _status = "Sold";
        } else if (this._lang == "zh-cn") {
          _status = "已卖出";
        } else if (this._lang == "zh-tw") {
          _status = "已賣出";
        }
        return _status;
      case "4":
        if (this._lang == "en") {
          _status = "Unavailable";
        } else if (this._lang == "zh-cn") {
          _status = "已下架";
        } else if (this._lang == "zh-tw") {
          _status = "已下架";
        }
        return _status;

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

  onCancel() {
    this.dialogSrv.confirmThis("Are you sure to cancel this?",
      () => {
        console.log("YES");
        this.editionSrv.updateStatusByEditionId(4, this.currentUser.id, this.editionId).subscribe(res => {
          if (res["result"] == "successful") {
            this.artwork.status = "4";
          }
          else {
            this.CancelFailed();
          }
        }, error => {
          console.error("cancel failed", error);
          this.CancelFailed();
        })
      }, () => {
        console.log("NO");
      });
  }

  CancelFailed() {
    this.dialogSrv.infoThis("Cancel failed. Please inform us.",
      () => { }, () => {

      });
  }
}
