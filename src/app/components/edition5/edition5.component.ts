import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { Utility } from "../../_helpers";
import {
  DataService,
  LikeService,
  GoogleAnalyticsService,
  SettingService,
} from "../../_services";

@Component({
  selector: "app-edition5",
  templateUrl: "./edition5.component.html",
  styleUrls: ["./edition5.component.css"],
})
export class Edition5Component implements OnInit {
  @Input() editionTitle: string;
  @Input() editionAuthor: string;
  @Input() editionImg: string;
  @Input() artworkId: string;
  @Input() editionDate: string;
  @Input() editionPrice: string;
  @Input() uid: string;
  IsFollowed = false;
  constructor(
    private settingSrv: SettingService,
    private gaSrv: GoogleAnalyticsService,
    private likeSrv: LikeService,
    private utility: Utility,
    private translateSrv: TranslateService,
    private dataSrv: DataService,
    private router: Router
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

    if (this.uid != null) {
      this.likeSrv.IsLike(this.uid, this.artworkId).subscribe(res => {
        if (res['result'] == "successful") {
          this.IsFollowed = res['data'];
        }
      });
    }
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

  ViewDetails() {

    this.gaSrv.eventEmitter("artwork", "page_view", "artwork", Number(this.artworkId));
    this.router.navigate(["/gallery/" + this.artworkId]);
  }

  onDislike() {
    this.gaSrv.eventEmitter("artwork", "dislike", "artwork", Number(this.artworkId));
    this.likeSrv.removeLike(this.uid, this.artworkId).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = false;
      }
    });
  }
  onLike() {
    this.gaSrv.eventEmitter("artwork", "like", "artwork", Number(this.artworkId));
    this.likeSrv.like(this.uid, this.artworkId).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = true;
      }
    });
  }


}
