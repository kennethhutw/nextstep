import { Component, ViewEncapsulation, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
  AppSettingsService,
  LikeService,
  AuthStore
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-artist-detail",
  templateUrl: "./artist-detail.component.html",
  styleUrls: ["./artist-detail.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistDetailComponent {
  lang = "en";
  _uid = null;
  currentUser: any = null;
  @Input() id: string;
  @Input() set uid(value) {
    this._uid = value;

  }
  @Input() isFollow: boolean = false;

  @Input() follow: number = 0;
  @Input() follower: number = 0;
  @Input() _tags: string[];
  @Input() set tags(values) {
    this._tags = [];

    if (values.length > -1) {
      let _values = values.split(",");

      this.appSettingsSrv.getTagOptions(this.lang).subscribe((data) => {

        if (data != null) {
          for (let tag of data) {
            if (_values.includes(tag.value)) {
              this._tags.push(tag.text);
            }
          };
        }
      });
    }
  }

  @Input() walletAddress: string = "0x";
  @Input() twitter: string = "";
  @Input() instagram: string = "";
  @Input() website: string = "";
  @Input() location: string = "";

  @Input() name: string;
  @Input() bio: string;
  @Input() src: string;

  constructor(
    private utility: Utility,
    private router: Router,
    private appSettingsSrv: AppSettingsService,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private likeSrv: LikeService,
    private authStoreSrv: AuthStore
  ) {
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
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
    console.log(" ================ ", this._uid);
    console.log(" ================ ", this.id);
    if (!this.utility.IsNullOrEmpty(this._uid)) {
      this.likeSrv.IsLike(this._uid, this.id).subscribe(res => {
        console.log(res);
      })
    }

    this.currentUser = this.authStoreSrv.getUserData();
    if (this.utility.IsNullOrEmpty(this.currentUser)) {
      this.router.navigate(['./index'], {});
    }

    this.likeSrv.IsLike(this.currentUser.id, this.id).subscribe(res => {
      console.log("rse ======== ", res);
      if (res['result'] === "successful") {
        this.isFollow = res['data'];
      }
    })
  }

  getDisplayWalletAddress() {
    //0xd7d4f0d1d46443fa79b81b3c3e6e578b98bdd0e8
    //0xd7d4...bdd0e8
    if (!this.utility.IsNullOrEmpty(this.walletAddress)) {
      let first = this.walletAddress.substring(0, 6);
      let last = this.walletAddress.substring(
        this.walletAddress.length - 6,
        this.walletAddress.length
      );
      return first + "..." + last;
    } else {
      return "";
    }
  }

  IsNullorEmpty(value) {
    return !this.utility.IsNullOrEmpty(value)
  }

  onLike() {
    this.likeSrv.like(this.currentUser.id, this.id).subscribe(res => {
      this.isFollow = true
    });
  }

  onDislike() {
    this.likeSrv.removeLike(this.currentUser.id, this.id).subscribe(res => {
      this.isFollow = false
    });
  }
}
