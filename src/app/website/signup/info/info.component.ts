import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  UserService,
  AuthStore
} from "../../../_services";
import { Utility } from "../../../_helpers";


import {
  Router,
  ActivatedRoute
} from "@angular/router";
@Component({
  selector: "app-signup-info",
  templateUrl: "./info.component.html",
  styleUrls: [
    "./info.component.css",
  ]
})
export class SignupInfoComponent implements OnInit {
  width = false;
  currentUser: any = null;
  profileImage = null;
  profileImageFile = null;
  step = 0;
  isProject = false;
  isPartner = false;
  beMentor = false;
  isMentor = false;

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    let screenHeight = window.innerHeight;
    let screenWidth = window.innerWidth;
    if (screenWidth > 991) {
      this.width = true;
    } else {
      this.width = false;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthStore,
    private userSrv: UserService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {


  }

  ngOnInit() {
    this.currentUser = this.authSrv.getUserData();
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  }

  onSubmit() {
    try {
      let _tags = "";
      if (this.isProject) {
        _tags += "findProject,";
      }
      if (this.isPartner) {
        _tags += "findPartner,";
      }
      if (this.beMentor) {
        _tags += "beMentor,";
      }
      if (this.isMentor) {
        _tags += "findMentor,";
      }

      let formData = new FormData();
      formData.append("id", this.currentUser.id);
      formData.append("tags", _tags);
      if (this.profileImageFile)
        formData.append("profileImage", this.profileImageFile);

      this.userSrv.updateUserBasicInfo(formData).subscribe(res => {
        console.log("=========== ", res)
        if (res['result'] == 'successful') {
          this.router.navigate(["./profile/Christian"], {});
        }
      })
    } catch (error) {
      console.log("failed", error);
    }

  }



  NextStep(value) {
    this.step = value;
  }

  onDetectImage(event) {
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.profileImageFile = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.profileImage = reader.result;
    }
  }
  onRemoveImg(event) {
    this.profileImage = null;
    this.profileImageFile = null;
  }
}
