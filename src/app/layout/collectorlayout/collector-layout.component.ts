import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, AuthStore, UserService, SettingService } from "../../_services";
import { Utility } from "../../_helpers";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-collector-layout",
  templateUrl: "./collector-layout.component.html",
  styleUrls: [
    "./collector-layout.component.css",
  ]
})
export class CollectorLayoutComponent implements OnInit {

  currentUser: any = null;
  IsEdit = false;
  UserName = "";
  profileImage = "";
  defaultProfileLogo = null;
  constructor(
    private settingSrv: SettingService,
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv: AuthStore,
    private userSrv: UserService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
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
    if (this.utility.IsNullOrEmpty(this.currentUser)) {
      this.router.navigate(['./index'], {});
    }
    this.UserName = this.currentUser.name;
    if (!this.utility.IsNullOrEmpty(this.currentUser.imageUrl)) {
      this.profileImage = environment.assetUrl + this.currentUser.imageUrl;
    }
  }

  ngOnInit() {
    this.UserName = this.currentUser.name;

    this.authStoreSrv.user$.subscribe(user => {
      this.currentUser = user;
      this.UserName = this.currentUser.name;
      if (!this.utility.IsNullOrEmpty(this.currentUser.imageUrl)) {
        this.profileImage = environment.assetUrl + this.currentUser.imageUrl;
      }
    });


  }

  GetCurrentUserName() {
    if (!this.utility.IsNullOrEmpty(this.currentUser)) {
      if (!this.utility.IsNullOrEmpty(this.currentUser.name)) {
        return this.currentUser.name;
      } else {
        return "[Name]";
      }
    } else {
      return "[Name]";
    }
  }

  SetEditMode() {
    this.IsEdit = true;
  }

  updateField() {

    this.userSrv.updateUserName(this.UserName, this.currentUser.id).subscribe(res => {
      if (res['result'] == 'successful') {
        this.currentUser.name = this.UserName;
        this.authStoreSrv.setUserData(this.currentUser);
      }
    });

  }
}
