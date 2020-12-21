import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-artist-basic",
  templateUrl: "./artist-basic.component.html",
  styleUrls: ["./artist-basic.component.css"],
})
export class ArtistBasicComponent implements OnInit {
  currentTab = "artworks";
  popularEditions = [];
  constructor(private translateSrv: TranslateService) {}

  ngOnInit() {

  }


  changeTab(tab) {
    this.currentTab = tab;
  }
}
