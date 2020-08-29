import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SubTabsComponent } from "../../components";
@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: [
    "./artist.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistComponent implements OnInit {

  currentTab = 'artworks';

  constructor(private translateSrv: TranslateService) {

  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }
  changeTab(tab) {
    this.currentTab = tab;
  }


}
