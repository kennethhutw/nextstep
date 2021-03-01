import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AuthStore,
  UserService,
  Web3Service
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { Router } from "@angular/router";
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

  constructor(
    private web3Srv: Web3Service,
    private router: Router,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private authStoreSrv: AuthStore,
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
      this.informEmail = this.currentUser.informEmail;
      this.ethAddress = this.currentUser.ethaddress;
    }
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

  updateInforEmail() {
    try {
      this.informMsg = null;
      this.IsUpdateInformEmailFailed = false;
      this.userSrv.updateUserInfoEmail(this.informEmail,
        this.currentUser.id).subscribe(res => {
          if (res["result"] === "successful") {
            this.currentUser.informEmail = this.informEmail;
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
      let result = this.web3Srv.verifyEthAddress(this.ethAddress);
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
      console.log(" updateUserPassword ");
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

}
