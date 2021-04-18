import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  TranslateService

} from "@ngx-translate/core";
import {
  ArtistService,
  AppSettingsService,
  AuthStore,
  SettingService
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
  artist = null;
  popularEditions = [];
  lang = "en";
  tags = [];
  defaultImg = "";
  uid = "";
  currentUser = null;
  defaultProfileLogo = null;
  constructor(
    private settingSrv: SettingService,
    private authStoreSrv: AuthStore,
    private route: ActivatedRoute,
    private translateSrv: TranslateService,
    private appSettingsSrv: AppSettingsService,
    private utility: Utility,
    private artistSrv: ArtistService) {
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
      const _artistUid = params["address"];
      // todo
      this.artistSrv.getArtistBasicInfoByUid(_artistUid).subscribe(res => {

        if (res["result"] === "successful") {
          this.artist = res["data"];
          if (this.artist && this.artist.imageUrl != null) {

            this.artist.imageUrl = environment.assetUrl + this.artist.imageUrl;
          }
          //tags: "bizarre,love,romantic"
        } else {

        }
      },
        error => {
          console.error(`ArtistPage error ${error}`);
        },
        () => {

        });

      this.artistSrv.getArtistArtwork(_artistUid).subscribe(res => {
        if (res["result"] === "successful") {
          this.popularEditions = res["data"];
          this.popularEditions.forEach((element) => {
            element.imageUrl = environment.assetUrl + element.imageUrl;
          });
        }
      },
        error => {
          console.error(`getArtistArtwork error ${error}`);
        },
        () => {

        });
    });


  }


}
