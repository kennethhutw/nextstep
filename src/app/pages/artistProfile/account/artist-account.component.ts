import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { AuthStore} from "./../../../_services";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-artist-account",
  templateUrl: "./artist-account.component.html",
  styleUrls: ["./artist-account.component.css"],
})
export class ArtistAccountComponent implements OnInit {
 email="admin@email.com";
 currentUser: any = null;
  constructor(
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv:AuthStore) {

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

    this.currentUser = this.authStoreSrv.getUserData();
    if(this.utility.IsNullOrEmpty(this.currentUser)){
 this.router.navigate(['./index'], {});
    }
  }

}
