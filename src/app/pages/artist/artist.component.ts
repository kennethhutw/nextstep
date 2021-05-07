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
  selector: "app-artist-page",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"],
})
export class ArtistPageComponent implements OnInit {
  artist = null;
  popularEditions = [];
  artistArtworks = [];
  lang = "en";
  tags = [];
  defaultImg = "";
  uid = "";
  currentUid = "";
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
      this.currentUid = this.currentUser.id;
    }
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {


    this.lang = localStorage.getItem("lang");
    this.route.params.subscribe(params => {
      this.uid = params["uid"];
      this.artistSrv.getArtistBasicInfoByUid(this.uid).subscribe(res => {
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

      this.artistSrv.getArtistArtwork(this.uid).subscribe(res => {
        if (res["result"] === "successful") {
          this.artistArtworks = res["data"];
          this.artistArtworks.forEach((element) => {
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
