import { Component, ViewEncapsulation, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistComponent {
  @Input() id: string;
  @Input() src: string;
  @Input() artistId: string;
  @Input() sales: number = 0;
  @Input() editions: number = 0;
  @Input() amount: number = 0;

  @Input() name: string;
  @Input() bio: string;

  constructor(
    private utility: Utility,
    private router: Router,
    private dataSrv: DataService,
    private translateSrv: TranslateService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    } else {
      this.translateSrv.use("zh-tw");
    }
  }
  GetArtistURL() {
    return "/token" + this.artistId;
  }

  routeToArtistProfile() {
    this.router.navigate(["./" + this.artistId], {});
  }

  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }
}
