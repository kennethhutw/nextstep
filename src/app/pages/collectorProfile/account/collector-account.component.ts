import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, AuthStore } from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { Router } from "@angular/router";
@Component({
  selector: "app-collector-account",
  templateUrl: "./collector-account.component.html",
  styleUrls: ["./collector-account.component.css"],
})
export class CollectorAccountComponent implements OnInit {
   currentUser: any = null;

  constructor(
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv:AuthStore) {}

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


  GetCurrentUserEmail(){
    if(!this.utility.IsNullOrEmpty(this.currentUser)){
        if(!this.utility.IsNullOrEmpty(this.currentUser.email)){
          return this.currentUser.email;
        } else{
          return "";
        }
      } else{
        return "";
      }
  }


}
