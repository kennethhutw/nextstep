import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  TranslateService

} from "@ngx-translate/core";
import {
  ArtistService,
  AppSettingsService,
  AuthStore
} from "../../_services";

import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Utility } from "../../_helpers";
@Component({
  selector: "app-artist-page",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"],
})
export class ArtistPageComponent implements OnInit {
  artist = null;
  popularEditions = [];
  lang = "en";
  tags = [];
  defaultImg = "";
  uid = "";
  currentUser = null;
  constructor(
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

  }

  ngOnInit() {


    this.lang = localStorage.getItem("lang");
    this.route.params.subscribe(params => {
      const _artistUid = params["uid"];
      this.artistSrv.getArtistBasicInfoByUid(_artistUid).subscribe(res => {

        if (res["result"] === "successful") {
          this.artist = res["data"];
          if (this.artist) {
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
