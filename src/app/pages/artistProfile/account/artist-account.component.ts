import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AuthStore,
  UserService,
  Web3Service,
  UserTourService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-artist-account",
  templateUrl: "./artist-account.component.html",
  styleUrls: ["./artist-account.component.css"],
})
export class ArtistAccountComponent implements OnInit {
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
  submitted = false;
  ethAddressActionMsg = null;
  ethAddressActionMsgFailed = false;
  emailForm: FormGroup;
  unamePattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
  constructor(
    private userTourSrv: UserTourService,
    private formBuilder: FormBuilder,
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
      //  this.informEmail = this.currentUser.email;
      //this.emailForm.setValue({ "email": this.currentUser.email });
      this.ethAddress = this.currentUser.ethaddress;
    }

    this.emailForm = this.formBuilder.group({
      email: [
        this.currentUser.email,
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ]
    });
    this.showUserTour();
  }

  showUserTour() {
    console.log("============= showUserTour");
    const step1 = this.userTourSrv.createStep("Step 1", "Link to your crypto wallet.", "#ethAddress", "", ['next']);
    // const step2 = this.userTourSrv.createStep("This title is optional.", "This is a red square and I am pointing at it from the bottom.", ".red-square", 'bottom', ['back', 'next']);
    // const step3 = this.userTourSrv.createStep("", "This is a yellow circle and there is no title. I am pointing at it from the left.", "#yellow-circle", "left", ['back', 'next']);

    const steps = [step1];

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
      this.submitted = true;
      this.informMsg = null;
      this.IsUpdateInformEmailFailed = false;
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
          this.translateSrv.get("FOUNDWALLET").subscribe((text: string) => {
            this.ethAddressActionMsg = text;
          });
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
              this.currentUser.ethAddress = this.ethAddress;
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
        });
    }
    catch (err) {
      console.warn(`changePassword ${err}`);
      this.submittedPSW = false;
    }
  }

}
