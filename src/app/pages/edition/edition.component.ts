import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  EditionService,
  AuthStore,
  GalleryService,
  SettingService,
  LikeService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: "edition",
  templateUrl: "./edition.component.html",
  styleUrls: ["./edition.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EditionComponent implements OnInit {
  IsFollowed = false;
  editions = [];
  transactions = [];
  editionId = null;
  currentEdition = null;
  currentUser: any = null;
  ethPrice = 0;
  uid = "";
  constructor(
    private settingSrv: SettingService,
    private route: ActivatedRoute,
    private authStoreSrv: AuthStore,
    private editionSrv: EditionService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private gallerySrv: GalleryService,
    private likeSrv: LikeService
  ) {
    this.currentUser = this.authStoreSrv.getUserData();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

    if (!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE"))) {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }

    this.route.params.subscribe(params => {

      this.editionId = params["editionId"];

      this.InitLike(this.currentUser.id, this.editionId);
      //  this.editionId = this.route.snapshot.paramMap.get("editionId");
      this.gallerySrv.getEditionDetailByEditionId(this.editionId).subscribe(res => {

        if (res['result'] === 'successful') {
          this.currentEdition = res['data'];
          this.uid = this.currentEdition['artist'].uid;
          if (!this.utility.IsNullOrEmpty(this.currentEdition.imageUrl)) {
            this.currentEdition.imageUrl = environment.assetUrl + this.currentEdition.imageUrl;
          }

          if (!this.utility.IsNullOrEmpty(this.currentEdition.artist.imageUrl)) {
            this.currentEdition.artist.imageUrl = environment.assetUrl + this.currentEdition.artist.imageUrl;
          }

          if (!this.utility.IsNullOrEmpty(this.currentEdition.editions)) {
            this.currentEdition.editions.forEach((element) => {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            });

            this.editions = this.currentEdition.editions;
            //this.currentEdition.artist.imageUrl = environment.assetUrl + this.currentEdition.artist.imageUrl;
          }
        }
        else {

        }
      },
        error => {
          console.error(`getEditionDetailByEditionId ${JSON.stringify(error)}`);
        }, () => {
          console.log("getEditionDetailByEditionId =============== finish.");
        });
    });
    // this.editions = [
    //   {
    //     id: "01",
    //     imageURL: "./assets/images/project-info-01.jpg",
    //   },
    //   {
    //     id: "02",
    //     imageURL: "./assets/images/project-info-02.jpg",
    //   },
    //   {
    //     id: "03",
    //     imageURL: "./assets/images/project-info-03.jpg",
    //   },
    //   {
    //     id: "04",
    //     imageURL: "./assets/images/project-info-04.jpg",
    //   },
    //   {
    //     id: "05",
    //     imageURL: "./assets/images/project-info-05.jpg",
    //   },
    //   {
    //     id: "06",
    //     imageURL: "./assets/images/project-info-06.jpg",
    //   },
    // ];
  }

  ngOnInit() {

  }

  InitLike(uid, liked_id) {
    this.likeSrv.IsLike(uid, liked_id).subscribe(res => {
      console.log(res);
      if (res['result'] == "successful") {
        this.IsFollowed = res['data'];
      }
    });
  }

  onLike() {
    this.likeSrv.like(this.currentUser.id, this.editionId).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = true;
      }
    });
  }

  onDislike() {
    this.likeSrv.removeLike(this.currentUser.id, this.editionId).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = false;
      }
    });
  }

  displaySellPrice() {
    if (Number(this.currentEdition.usdValue)) {
      let usd = parseFloat(this.currentEdition.usdValue);
      let ethSoldValue = +((usd / 100) / this.ethPrice).toFixed(5);
      return ethSoldValue;
    }
  }
}
