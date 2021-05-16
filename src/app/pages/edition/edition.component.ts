import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  EditionService,
  AuthStore,
  GalleryService,
  EmailService,
  LikeService,
  Web3Service,
  ArtWorkService,
  UserService,
  DialogService,
  SettingService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalService } from '../../_modal';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';

@Component({
  selector: "edition",
  templateUrl: "./edition.component.html",
  styleUrls: ["./edition.component.css"]
})
export class EditionComponent implements OnInit {

  mdlSampleIsOpen: boolean = false;
  IsFollowed = false;
  editions = [];
  transactions = [];
  artworkId = null;
  // currentEdition = null;
  currentArtwork = null;
  currentUser: any = null;
  ethPrice = 0;
  usdValue = 0;
  uid = "";
  ethSoldValue = 0;
  submitted = false;
  _timer = null;
  options = new CircleProgressOptions();

  duration = 30 * 1000; // 10 seconds
  constructor(
    private modalService: ModalService,
    public settingSrv: SettingService,
    private dialogSrv: DialogService,
    private artworkSrv: ArtWorkService,
    private emailSrv: EmailService,
    private route: ActivatedRoute,
    private authStoreSrv: AuthStore,
    private editionSrv: EditionService,
    private Web3Srv: Web3Service,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private gallerySrv: GalleryService,
    private likeSrv: LikeService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.SpinnerService.show();
    this.currentUser = this.authStoreSrv.getUserData();
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

    if (!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE"))) {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }

    this.route.params.subscribe(params => {

      this.artworkId = params["artworkId"];
      if (this.currentUser)
        this.InitLike(this.currentUser.id, this.artworkId);
      //  this.editionId = this.route.snapshot.paramMap.get("editionId");
      this.gallerySrv.getEditionDetailByEditionId(this.artworkId).subscribe(res => {

        if (res['result'] === 'successful') {

          this.currentArtwork = res['data'];
          this.uid = this.currentArtwork['artist'].uid;
          if (!this.utility.IsNullOrEmpty(this.currentArtwork.imageUrl)) {
            this.currentArtwork.imageUrl = environment.assetUrl + this.currentArtwork.imageUrl;
          }

          if (!this.utility.IsNullOrEmpty(this.currentArtwork.artist.imageUrl)) {
            this.currentArtwork.artist.imageUrl = environment.assetUrl + this.currentArtwork.artist.imageUrl;
          }

          if (!this.utility.IsNullOrEmpty(this.currentArtwork.editions)) {
            this.currentArtwork.editions.forEach((element) => {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            });

            this.editions = this.currentArtwork.editions;
            //this.currentArtwork.artist.imageUrl = environment.assetUrl + this.currentArtwork.artist.imageUrl;
          }
        }
        else {

        }
      },
        error => {
          console.error(`getEditionDetailByEditionId ${JSON.stringify(error)}`);
        }, () => {
          this.SpinnerService.hide();
          console.log("getEditionDetailByEditionId =============== finish.");
        });
    });

  }

  ngOnInit() {

  }

  InitLike(uid, liked_id) {
    this.likeSrv.IsLike(uid, liked_id).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = res['data'];
      }
    });
  }

  onLike() {
    this.likeSrv.like(this.currentUser.id, this.artworkId).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = true;
      }
    });
  }

  onDislike() {
    this.likeSrv.removeLike(this.currentUser.id, this.artworkId).subscribe(res => {
      if (res['result'] == "successful") {
        this.IsFollowed = false;
      }
    });
  }

  displaySellPrice() {
    if (Number(this.currentArtwork.ethValue)) {
      let eth = parseFloat(this.currentArtwork.ethValue);

      this.ethSoldValue = +(eth / 100).toFixed(2);

      return this.ethSoldValue;
    }
  }
  displayUSDPrice() {
    if (Number(this.currentArtwork.ethValue)) {
      let eth = parseFloat(this.currentArtwork.ethValue);

      this.currentArtwork.usdValue = +(eth / 100 * this.ethPrice).toFixed(2);
      return this.currentArtwork.usdValue;
    }
  }
  async purchase() {
    if (this.currentUser) {
      if (this.Web3Srv.ethEnabled()) {
        let _networkId = await this.Web3Srv.getNetworkId();
        // detect network
        if (environment.environment == "staging") {
          if (_networkId != 4) {
            this.dialogSrv.infoThis("Network is not correct.<br> Please change to the correct network ",
              () => {

              }, () => {
              });
            return;
          }
        } else if (environment.environment == "production") {
          if (_networkId != 1) {
            this.dialogSrv.infoThis("Network is not correct.<br> Please change to the correct network ",
              () => {

              }, () => {
              });
            return;
          }
        }

        let address = await this.Web3Srv.getAccount();
        console.log(" address ", address);
        let weiSoldValue = this.Web3Srv.EthToWei(this.ethSoldValue.toString());

        //https://ethereum.stackexchange.com/questions/39237/how-to-get-transaction-hash-of-a-function-call-from-web3/67859
        this.Web3Srv.purchase('purchase', weiSoldValue, this.currentArtwork.firstnumber).then(async res => {
          console.log("purchase result " + res);
          this.currentArtwork.status = 3;
          let networkId = await this.Web3Srv.getNetworkId();

          this.artworkSrv.purchase(this.currentUser.id,
            res['from'],
            this.currentArtwork.usdValue * 100,
            this.ethSoldValue * 100,
            this.currentArtwork.artistId,
            this.currentUser.id,
            res['from'],
            this.currentArtwork.editionId,
            this.currentArtwork.id,
            res['transactionHash'],
            res['from'],
            res['to'],
            this.currentArtwork.id,
            networkId).subscribe(purchaseRes => {
              console.log("purchaseRes" + purchaseRes);
              this.dialogSrv.infoThis("Purchase successfully",
                () => {
                  console.log("yes ===");
                  this.informArtist();
                  this.informBuyer();
                }, () => {
                  this.informArtist();
                  this.informBuyer();
                  console.log("no ===");
                });
            }, error => {
              console.log("purchaseRes failed" + error);
            });

        }).catch(error => {
          console.error("purchase failed " + error.message);

          this.dialogSrv.infoThis("Purchase failed!! Please inform us if you still cannot buy this.",
            () => {
              console.log("yed ===");
            }, () => {
              console.log("no ===");
            });
        })
      }
    } else {
      if (this.Web3Srv.ethEnabled()) {
        this.Web3Srv.getAccountDetail().then(
          (data) => {
            this.authStoreSrv.walletSignin(data.address, "collector").subscribe((result) => {
              this.currentUser = this.authStoreSrv.getUserData();
              if (this.currentUser) {
                this.authStoreSrv.user$.subscribe(user => { this.currentUser = user });
              }
            },
              errorMsg => {
                console.log('error', errorMsg);
              });
          },
          (error) => {
            console.log("getAccountDetail error", error);
          }
        );
      } else {
        console.warn("Metamask not found Install or enable Metamask");
      }
    }
  }

  test() {
    this.informArtist();
    this.informBuyer();
  }

  informArtist() {

    let domain = window.location.origin;
    let url = '/gallery/' + this.artworkId;
    let link = domain + url;
    this.emailSrv.sendSoldEmail(
      'Your artwork sold',
      this.currentArtwork.artist.name,
      this.currentArtwork.artist.email,
      link,
      this.currentArtwork.name,
      this.currentUser.id).subscribe(sendRes => {
        console.log("error = ", sendRes);
        if (sendRes['result'] == 'successful') {
          //         this.toastSrv.showToast('Success', "Inform Email Sent", this.toastSrv.iconClasses.success);
        } else {
          //       this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        console.error("error = ", error);
        //       this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });
  }

  informBuyer() {

    if (!this.currentUser) {
      return;
    }
    if (this.utility.IsNullOrEmpty(this.currentUser.email)) {
      return;
    }
    let domain = window.location.origin;
    let url = '/gallery/' + this.artworkId;
    let link = domain + url;
    this.emailSrv.sendPurchaseEmail(
      'Thank you for your purchase',
      this.currentUser.name,
      this.currentUser.email,
      link,
      this.currentArtwork.name,
      this.currentUser.id).subscribe(sendRes => {
        console.log("error = ", sendRes);
        if (sendRes['result'] == 'successful') {
          //         this.toastSrv.showToast('Success', "Inform Email Sent", this.toastSrv.iconClasses.success);
        } else {
          //       this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        console.error("error = ", error);
        //       this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });
  }

  openModal(open: boolean): void {
    this.mdlSampleIsOpen = open;
    this.start();
  }

  openModal2(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  start = () => {
    if (this._timer !== null) {
      clearInterval(this._timer);
    }
    this._timer = window.setInterval(() => {
      this.options.percent = (Math.round(Math.random() * 100));
    }, 1000);
  }
  titletFormat = (percent: number) => {
    console.log("titletFormat =============== ", percent);
    if (percent >= 100) {
      return "Congratulations!"
    } else {
      return "Progress"
    }
  }
  subtitleFormat = (percent: number) => {
    console.log("subtitleFormat =============== ", percent);
    if (percent >= 100) {
      return "Congratulations!"
    } else {
      return "Progress"
    }
  }
}
