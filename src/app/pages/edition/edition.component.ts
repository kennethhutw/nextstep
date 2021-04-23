import { Component, OnInit, ViewEncapsulation } from "@angular/core";
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

@Component({
  selector: "edition",
  templateUrl: "./edition.component.html",
  styleUrls: ["./edition.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class EditionComponent implements OnInit {
  IsFollowed = false;
  editions = [];
  transactions = [];
  artworkId = null;
  // currentEdition = null;
  currentArtwork = null;
  currentUser: any = null;
  ethPrice = 0;
  uid = "";
  ethSoldValue = 0;
  constructor(
    private settingSrv: SettingService,
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
          console.log("  this.currentArtwork ======= ", this.currentArtwork)
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
    if (Number(this.currentArtwork.usdValue)) {
      let usd = parseFloat(this.currentArtwork.usdValue);

      this.ethSoldValue = +((usd / 100) / this.ethPrice).toFixed(5);

      return this.ethSoldValue;
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
        this.Web3Srv.purchase('purchase', weiSoldValue, this.currentArtwork.firstnumber).then(async res => {
          console.log("purchase result " + res);
          this.currentArtwork.status = 3;
          let networkId = await this.Web3Srv.getNetworkId();

          this.artworkSrv.purchase(this.currentUser.id,
            res['from'],
            this.currentArtwork.usdValue,
            this.ethSoldValue,
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
                }, () => {
                  this.informArtist();
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


  informArtist() {

    let domain = window.location.origin;
    let url = '/gallery/' + this.artworkId;
    let link = domain + url;
    this.emailSrv.sendAvailableEmail(
      'Your artwork is available now on Formosart',
      this.currentArtwork.artist.name,
      this.currentArtwork.email,
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
}
