import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  TranslateService

} from "@ngx-translate/core";
import {
  LikeService,
  AppSettingsService,
  AuthStore,
  SettingService,
  UserService
} from "../../_services";

import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Utility } from "../../_helpers";
@Component({
  selector: "app-collector-page",
  templateUrl: "./collector.component.html",
  styleUrls: ["./collector.component.css"],
})
export class CollectorPageComponent implements OnInit {
  collector = null;
  artists = [];
  displayArtists = [];
  popularEditions = [];
  lang = "en";
  tags = [];
  defaultImg = "";
  uid = "";
  currentUser = null;
  defaultProfileLogo = null;
  currentTab = "collection";
  constructor(
    private settingSrv: SettingService,
    private authStoreSrv: AuthStore,
    private route: ActivatedRoute,
    private translateSrv: TranslateService,
    private appSettingsSrv: AppSettingsService,
    private utility: Utility,
    private userSrv: UserService,
    private likeSrv: LikeService) {
    this.defaultImg = this.appSettingsSrv.defulatImage;
    this.currentUser = this.authStoreSrv.getUserData();

    if (this.currentUser) {
      this.uid = this.currentUser.id;
    }
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {


    this.lang = localStorage.getItem("lang");
    this.route.params.subscribe(params => {
      const _collectorAddress = params["address"];

      if (_collectorAddress.indexOf("0x") > -1) {
        // todo
        this.initFavourites(_collectorAddress);
        this.userSrv.getUserInfoByAddress(_collectorAddress).then(res => {
          if (res["result"] === "successful") {
            this.collector = res["data"];
            if (this.collector && this.collector.imageUrl != null) {

              this.collector.imageUrl = environment.assetUrl + this.collector.imageUrl;
            }
            if (this.collector && this.collector.ownedartwork && this.collector.ownedartwork.length > 0) {
              this.popularEditions = this.collector.ownedartwork;
              this.popularEditions.forEach((element) => {
                element.imageUrl = environment.assetUrl + element.imageUrl;
              });

            }

          } else {

          }
        }).catch(error => {
          console.error(`ArtistPage error ${error}`);
        })
      }
      //   this.userSrv.getUserOwnArtworks(_collectorAddress).subscribe(res => {
      //     if (res["result"] === "successful") {
      //       this.popularEditions = res["data"];
      //       this.popularEditions.forEach((element) => {
      //         element.imageUrl = environment.assetUrl + element.imageUrl;
      //       });
      //     }
      //   },
      //     error => {
      //       console.error(`getUserOwnArtworks error ${error}`);
      //     },
      //     () => {

      //     });
    });


  }

  initFavourites(address) {
    this.likeSrv.getUserLikeByAddress(address).subscribe(res => {

      if (res['result'] == 'successful') {
        this.artists = res['data'];
        this.artists.forEach((element) => {
          if (element['imageUrl']) {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          }
        });
        this.displayArtists = this.artists;

      }
    }, error => {
      console.error("getUserLikeByAddress ", error);
    });
  }

  changeTab(tab) {
    this.currentTab = tab;
  }
}
