import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  TranslateService

} from "@ngx-translate/core";
import {
  ArtistService,
  AppSettingsService,
  AuthStore,
  SettingService,
  UserService,
  DataService,
  LikeService
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
  collection = [];
  artistArtworks = [];
  favourites = [];
  displayFavourites = [];
  lang = "en";
  tags = [];
  defaultImg = "";
  uid = "";
  currentUid = "";
  currentUser = null;
  defaultProfileLogo = null;

  currentTab = "artworks";
  constructor(
    private settingSrv: SettingService,
    private authStoreSrv: AuthStore,
    private route: ActivatedRoute,
    private translateSrv: TranslateService,
    private appSettingsSrv: AppSettingsService,
    private utility: Utility,
    private likeSrv: LikeService,
    private dataSrv: DataService,
    private userSrv: UserService,
    private artistSrv: ArtistService) {
    this.defaultImg = this.appSettingsSrv.defulatImage;
    this.currentUser = this.authStoreSrv.getUserData();

    if (this.currentUser) {
      this.currentUid = this.currentUser.id;
    }
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

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
    this.lang = localStorage.getItem("lang");
    this.route.params.subscribe(params => {
      this.uid = params["uid"];
      this.initFavourites(this.uid)
      this.initCollection(this.uid)
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

  initCollection(uid) {
    this.userSrv.getUserOwnArtworksByUid(uid).subscribe(res => {

      if (res["result"] === "successful") {
        this.collection = res["data"];
        if (this.collection) {

          this.collection.forEach((element) => {
            element.imageUrl = environment.assetUrl + element.imageUrl;
          });
        }

      } else {

      }
    }, error => {
      console.error(`getUserOwnArtworksByUid error ${error}`);
    })
  }

  initFavourites(uid) {
    this.likeSrv.getUserLikeArtWorkByUid(uid).subscribe(res => {
      console.log("getUserLikeArtWorkByUid ================", res);
      if (res['result'] == 'successful') {
        this.favourites = res['data'];
        this.favourites.forEach((element) => {
          if (element['imageUrl']) {
            element['imageUrl'] = environment.assetUrl + element['imageUrl'];
          }
        });
        this.displayFavourites = this.favourites;
      }
    }, error => {
      console.error("getUserLikeByAddress ", error);
    });
  }

  changeTab(tab) {
    this.currentTab = tab;
  }
}
