import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AuthStore,
  UserService,
  Web3Service,
  UserTourService
} from "./../../../_services";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Utility } from "./../../../_helpers";
import { Router } from "@angular/router";
import { resResult, UserModel } from "../../../_models";

@Component({
  selector: "app-collector-account",
  templateUrl: "./collector-account.component.html",
  styleUrls: ["./collector-account.component.css"],
})
export class CollectorAccountComponent implements OnInit {
  currentUser: any = null;
  oldPSW = "";
  newPSW = "";
  confirmPSW = "";
  submittedPSW = false;
  pswActionMsg = null;
  pswMsgFailed = false;
  informEmail = "";
  informMsg = null;
  IsUpdateInformEmailFailed = false;
  ethAddress = "";
  ethAddressActionMsg = null;
  ethAddressActionMsgFailed = false;

  profileImage: any;
  profileImageFile: any;
  profileForm: FormGroup;

  IsUpdateFailed = false;
  submitted = false;
  emailForm: FormGroup;
  constructor(
    private userTourSrv: UserTourService,
    private web3Srv: Web3Service,
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv: AuthStore,
    private formBuilder: FormBuilder,
    private userSrv: UserService) { }

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
    if (this.utility.IsNullOrEmpty(this.currentUser)) {
      this.router.navigate(['./index'], {});
    }
    else {
      this.informEmail = this.currentUser.email;
      this.ethAddress = this.currentUser.ethaddress;
    }


    this.profileForm = this.formBuilder.group({
      name: [""],
      bio: [""]
    });
    this.profileForm.setValue({
      name: this.currentUser.name,
      bio: this.currentUser.bio
    });

    this.emailForm = this.formBuilder.group({
      email: [
        this.currentUser.email,
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ]
    });
    this.showCollectorTour();
  }
  showCollectorTour() {
    console.log("============= showUserTour");

    const step1 = this.userTourSrv.createStep("Step 1", "Link to your crypto wallet.", "#ethAddress", "top", ['next']);
    const step2 = this.userTourSrv.createStep("Step 2", "Purchase artworks on FormosArt Gallery.", "#galleryLink", 'bottom', ['next']);
    const step3 = this.userTourSrv.createStep("Step 3", "View your collection on FormosArt.", "#collector_profile_link", "left", ['next']);

    const steps = [step1, step2, step3];

    this.userTourSrv.startTour(steps);
  }

  GetCurrentUserEmail() {
    if (!this.utility.IsNullOrEmpty(this.currentUser)) {
      if (!this.utility.IsNullOrEmpty(this.currentUser.email)) {
        return this.currentUser.email;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  GetCurrentUserInformEmail() {
    if (!this.utility.IsNullOrEmpty(this.currentUser)) {
      if (!this.utility.IsNullOrEmpty(this.currentUser.email)) {
        return this.currentUser.email;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  get f() {
    return this.emailForm.controls;
  }
  updateInforEmail() {
    try {
      this.informMsg = null;
      this.IsUpdateInformEmailFailed = false;
      this.submitted = true;

      if (this.emailForm.invalid) {

        return;
      }
      this.userSrv.updateUserEmail(this.emailForm.value.email,
        this.currentUser.id).subscribe(res => {
          if (res["result"] === "successful") {
            this.currentUser.email = this.emailForm.value.email,
              this.authStoreSrv.setUserData(this.currentUser);
            this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
              this.informMsg = text;
            });
          }
          else {
            this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
              this.informMsg = text;
              this.IsUpdateInformEmailFailed = true;
            });
          }
        }, error => {
          this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
            this.informMsg = text;
            this.IsUpdateInformEmailFailed = true;
          });
          console.error(`updateUserInfoEmail failed : ${error}`);
        }, () => {
          this.authStoreSrv.reloadCurrentUserInfo();
        });
    } catch (err) {
      this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
        this.informMsg = text;
        this.IsUpdateInformEmailFailed = true;
      });
      console.error(`updateUserInfoEmail failed : ${err}`);
    }
  }

  getWalletAddress() {
    this.ethAddressActionMsg = null;
    this.ethAddressActionMsgFailed = false;
    if (this.web3Srv.ethEnabled()) {
      this.web3Srv.getAccountDetail().then(
        (data) => {
          this.ethAddress = data.address;
        },
        (error) => {
          console.warn(`NOTFOUNDWALLET ${error}`);
          this.translateSrv.get("NOTFOUNDWALLET").subscribe((text: string) => {
            this.ethAddressActionMsg = text;
            this.ethAddressActionMsgFailed = true;
          });
        }
      );
    } else {
      this.translateSrv.get("NOTFOUNDWALLET").subscribe((text: string) => {
        this.ethAddressActionMsg = text;
        this.ethAddressActionMsgFailed = true;
      });
      console.warn("Metamask not found Install or enable Metamask");
    }
  }

  verifyEthAddress() {
    try {
      this.ethAddressActionMsg = null;
      this.ethAddressActionMsgFailed = false;
      console.log("this.ethAddress =============", this.ethAddress);
      let result = this.web3Srv.verifyEthAddress(this.ethAddress.toLowerCase());
      if (result) {
        this.translateSrv.get("VALIDADDRESS").subscribe((text: string) => {
          this.ethAddressActionMsg = text;
        });
      } else {
        this.ethAddressActionMsgFailed = true;
        this.translateSrv.get("INVALIDADDRESS").subscribe((text: string) => {
          this.ethAddressActionMsg = text;
          this.ethAddressActionMsgFailed = true;
        });
      }
    }
    catch (err) {
      console.warn(`NOTFOUNDWALLET ${err}`);
      this.translateSrv.get("INVALIDADDRESS").subscribe((text: string) => {
        this.ethAddressActionMsg = text;
        this.ethAddressActionMsgFailed = true;
      });
    }
  }

  updateWalletAddress() {
    try {
      this.ethAddressActionMsg = null;
      this.ethAddressActionMsgFailed = false;
      let result = this.web3Srv.verifyEthAddress(this.ethAddress);
      if (result) {
        this.userSrv.changeWalletAddress(this.ethAddress,
          this.currentUser.id).subscribe(res => {
            if (res["result"] === "successful") {
              this.currentUser.informEmail = this.informEmail;
              this.authStoreSrv.setUserData(this.currentUser);
              this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
                this.ethAddressActionMsg = text;
              });

            }
            else {
              this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
                this.ethAddressActionMsg = text;
                this.ethAddressActionMsgFailed = true;
              });
            }
          }, error => {
            this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
              this.ethAddressActionMsg = text;
              this.ethAddressActionMsgFailed = true;
            });
            console.error(`updateUserInfoEmail failed : ${error}`);
          }, () => {
            this.authStoreSrv.reloadCurrentUserInfo();
          });
      } else {
        this.ethAddressActionMsgFailed = true;
        this.translateSrv.get("INVALIDADDRESS").subscribe((text: string) => {
          this.ethAddressActionMsg = text;
          this.ethAddressActionMsgFailed = true;
        });
      }
    }
    catch (err) {
      console.warn(`NOTFOUNDWALLET ${err}`);
      this.translateSrv.get("INVALIDADDRESS").subscribe((text: string) => {
        this.ethAddressActionMsg = text;
        this.ethAddressActionMsgFailed = true;
      });
    }
  }

  updateUserPassword() {
    try {
      this.submittedPSW = true;
      if (this.newPSW !== this.confirmPSW ||
        this.newPSW === "" ||
        this.confirmPSW === "") {
        return;
      }
      this.pswActionMsg = null;
      this.pswMsgFailed = false;
      this.userSrv.changePassword(this.oldPSW,
        this.newPSW,
        this.currentUser.id).subscribe(res => {
          if (res["result"] === "successful") {
            this.oldPSW = "";
            this.newPSW = "";
            this.confirmPSW = "";
            this.submittedPSW = false;
            this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
              this.pswActionMsg = text;
            });
          } else {
            this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
              this.pswActionMsg = text;
              this.pswMsgFailed = true;
            });
          }
        }, error => {
          this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
            this.pswActionMsg = text;
            this.pswMsgFailed = true;
          });
          console.error(`changePassword failed : ${error}`);
        })
      // let result = this.web3Srv.verifyEthAddress(this.ethAddress);
      // if(result){
      //     this.userSrv.changeWalletAddress(this.ethAddress,
      //    this.currentUser.id).subscribe(res=>{
      //         if (res["result"] === "successful") {
      //           this.currentUser.informEmail = this.informEmail;
      //           this.authStoreSrv.setUserData(this.currentUser);
      //           this.ethAddressActionMsg = "Updated successfully";
      //         }
      //         else{
      //            this.ethAddressActionMsg = "Updated failed";
      //            this.ethAddressActionMsgFailed = true;
      //         }
      // },error=>{
      //   this.ethAddressActionMsg = "Updated failed";
      //   this.ethAddressActionMsgFailed = true;
      //   console.error(`updateUserInfoEmail failed : ${error}`);
      // });
      // }else{
      //    this.ethAddressActionMsgFailed = true;
      //     this.translateSrv.get("INVALIDADDRESS").subscribe((text: string) => {
      //     this.ethAddressActionMsg = text;
      //     this.ethAddressActionMsgFailed = true;
      //   });
      // }
    }
    catch (err) {
      console.warn(`changePassword ${err}`);
      this.submittedPSW = false;
    }
  }

  onRemoveImg(event) {
    this.profileImage = null;
    this.profileImageFile = null;
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

  onSubmit() {
    let userInfo = new UserModel();
    userInfo.name = this.profileForm.value.name;
    userInfo.bio = this.profileForm.value.bio;
    this.informMsg = "";
    this.IsUpdateFailed = false;

    let formData = new FormData();
    formData.append("id", this.currentUser.id);
    formData.append("uid", this.currentUser.id);
    formData.append("name", userInfo.name);
    formData.append("bio", userInfo.bio);
    if (this.profileImageFile)
      formData.append("profileImage", this.profileImageFile);

    this.userSrv.updateUserBasicInfo(formData).subscribe(res => {
      if (res["result"] === "successful") {
        this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
          this.informMsg = text;

        });
        this.authStoreSrv.reloadCurrentUserInfo();
      }
      else {
        this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
          this.informMsg = text;
          this.IsUpdateFailed = true;
        });
      }
    }, error => {
      this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
        this.informMsg = text;
        this.IsUpdateFailed = true;
      });
      console.error("update Basic infor failed", error);
    });
  }



}
