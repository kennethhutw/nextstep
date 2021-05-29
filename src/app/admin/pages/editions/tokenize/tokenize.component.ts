import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  UserService,
  AuthStore,
  ToastService,
  EmailService,
  EditionService,
  Web3Service,
  ArtistService
} from '../../../../_services';

import {
  ActivatedRoute
} from "@angular/router";
import {
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Utility } from "../../../../_helpers";

@Component({
  selector: 'app-admin-tokenize',
  templateUrl: './tokenize.component.html',
  styleUrls: ['./tokenize.component.css']
})
export class TokenizeComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  tokenizeForm: FormGroup;
  tokenUriForm: FormGroup;
  newArtWorkForm: FormGroup;
  artist: any;
  edition: any = null;
  currentUser: any;
  assetImgUrl = "";
  tokenUri: any = null;
  loading = false;
  showTokenUriPanel = false;
  highestEditionNumber = -1;
  highestDBEditionNumber = -1;
  highestDBArtworkNumber = -1;
  newFirstnumber = -1;
  tokenizeUri = "aaaaa";
  constructor(
    private utility: Utility,
    private formBuilder: FormBuilder,
    private authStoreSrv: AuthStore,
    private editionSrv: EditionService,
    private emailSrv: EmailService,
    private toastSrv: ToastService,
    private route: ActivatedRoute,
    private artistSrv: ArtistService,
    private web3Srv: Web3Service
  ) { }

  ngOnInit() {
    // 0x0000000000000000000000000000000000000000000000000000000000000000
    this.currentUser = this.authStoreSrv.getUserData();

    this.tokenizeForm = this.formBuilder.group({
      editionNumber: [""],
      editionData: "0x6c00000000000000000000000000000000000000000000000000000000000000",
      editionType: 1,
      startDate: [""],
      endDate: [""],
      artistAccount: [""],
      artistCommission: 85,
      priceInEth: 0,
      tokenURI: [""],
      totalAvailable: 0,
    });

    this.tokenUriForm = this.formBuilder.group({
      tokenId: [""],
      editionId: [""],
      name: [""],
      description: [""],
      artist: [""],
      tags: [""],
      asset_type: [""],
      external_uri: [""],
      imageUri: [""],
      artistAddress: [""],
    });


    this.newArtWorkForm = this.formBuilder.group({
      editionId: [""],
      artistId: [""],
      name: [""],
      description: [""],
      ethValue: 0,
      tags: [""],
      isBid: [""],
      image_type: [""],
      imageName: [""],
      imageUri: [""],
      totalamount: [""],
      firstnumber: [""],
    });

    this.route.params.subscribe(params => {
      const _editionid = params["id"];
      this.initEdition(_editionid);
    });


  }

  ngAfterViewInit(): void {

  }



  ngOnDestroy(): void {

  }

  initEdition(id) {
    try {
      this.editionSrv.getTokenizeEdition(id).subscribe(res => {
        console.log(` getEdition ${res}`, res);
        if (res['result'] == 'successful') {
          this.edition = res['data'];
          if (this.edition != null) {
            this.initArtist(this.edition.artistId);
          }
          this.assetImgUrl = environment.assetUrl + this.edition.imageUrl;
          let _eth = this.edition.ethValue / 100; //this.utility.getSellETHPrice(this.edition.usdValue);
          this.tokenizeForm.setValue({
            editionNumber: this.edition.firstnumber,
            editionData: "0x0000000000000000000000000000000000000000000000000000000000000000",
            editionType: 1,
            startDate: [""],
            endDate: [""],
            artistAccount: this.edition.ethaddress,
            artistCommission: this.edition.commission,
            priceInEth: _eth,
            tokenURI: this.edition.tokenUri,
            totalAvailable: this.edition.totalamount,
          });

          let domain = window.location.origin;
          if (domain.indexOf('localhost') > 0) {
            domain = 'http://staging.formosart.io';
          }
          let url = '/artist/' + this.edition.ethaddress;
          let link = domain + url;
          this.tokenUriForm.setValue({
            tokenId: "",
            editionId: this.edition.id,
            name: this.edition.artworkName,
            description: this.edition.description,
            artist: this.edition.ArtistName,
            artistAddress: this.edition.ethaddress,
            tags: this.edition.tags,
            asset_type: this.edition.image_type,
            external_uri: 'https://www.formosart.io',
            imageUri: "./.." + this.edition.imageUrl,
          });
          console.log("_eth", _eth);
          this.newArtWorkForm.setValue({
            artistId: this.edition.artistId,
            editionId: this.edition.id,
            name: this.edition.artworkName,
            description: this.edition.description,
            ethValue: _eth,
            tags: this.edition.tags,
            isBid: this.edition.isBid,
            image_type: this.edition.image_type,
            imageName: this.edition.imageName,
            imageUri: this.edition.imageUrl,
            firstnumber: this.edition.firstnumber,
            totalamount: this.edition.totalamount,
          });
        }
      }, error => {
        console.error(` get initEdition :  `, error);

      })
    } catch (error) {
      console.error(` get initEdition :  `, error);
    }
  }

  initArtist(id) {
    this.artistSrv.getArtistBasicInfo(id).subscribe(res => {
      console.log(" getArtistBasicInfoByUid ==== ", res);
      if (res["result"] === "successful") {
        this.artist = res["data"];

      } else {

      }
    }, error => {
      console.error(` initial Artist failed`, error);
    })
  }

  onClear() {

  }

  Tokenize() {
    if (this.web3Srv.ethEnabled()) {

      var unixtimestamp = (new Date(this.tokenizeForm.value.startDate)).getTime() / 1000;

      let priceInWei = this.web3Srv.EthToWei(this.tokenizeForm.value.priceInEth.toString());
      if (this.web3Srv.loadContract()) {
        this.web3Srv.executeTransaction('createActiveEdition',
          this.tokenizeForm.value.editionNumber,
          this.tokenizeForm.value.editionData,
          this.tokenizeForm.value.editionType,
          "1619100935",
          0,
          this.tokenizeForm.value.artistAccount,
          this.tokenizeForm.value.artistCommission,
          priceInWei,
          this.tokenizeForm.value.tokenURI,
          this.tokenizeForm.value.totalAvailable
        ).then(res => {
          console.log(' Tokenize res ==========', res);
        }).catch(err => {
          console.error('Tokenize name err ==========', err);
        });
      }
    }
  }

  get t() {
    return this.tokenUriForm.controls;
  }

  get f() {
    return this.tokenizeForm.controls;
  }

  createTokenUri() {

    this.editionSrv.createIPFSLink(this.tokenUriForm.value.editionId,
      this.tokenUriForm.value.tokenId,
      this.tokenUriForm.value.name,
      this.tokenUriForm.value.description,
      this.tokenUriForm.value.artist,
      this.tokenUriForm.value.tags,
      this.tokenUriForm.value.asset_type,
      this.tokenUriForm.value.external_uri,
      this.tokenUriForm.value.imageUri
    ).subscribe(res => {
      if (res["result"] == "successful") {
        this.tokenUri = res['data'];
        this.tokenizeUri = this.tokenUri;
        this.tokenizeForm.controls['tokenURI'].setValue(this.tokenUri);
        this.tokenizeForm.controls['editionNumber'].setValue(this.tokenUriForm.value.tokenId);
        this.newFirstnumber = this.tokenUriForm.value.tokenId;
        this.newArtWorkForm.controls['firstnumber'].setValue(this.tokenUriForm.value.tokenId);
      } else {
        this.tokenUriForm.value.editionId
        this.tokenUri = res['message'];
        this.tokenizeUri = this.tokenUri;
      }

    }, error => {
      console.error(` createTokenUri error :  `, error);
      this.tokenizeUri = "failed!!!" + this.tokenUri;
    });
  }

  showTokenUri() {
    this.showTokenUriPanel = !this.showTokenUriPanel;
  }

  getTokenUri() {
    this.editionSrv.getTokenizeEdition(this.edition.id).subscribe(res => {
      console.log(` res getTokenUri : ${res} `);
      if (res["result"] == "successful") {
        this.tokenUri = res['data']['tokenUri'];
        if (this.tokenUri === "undefined") {
          this.tokenUri = "No Link";
        }
      }
      else {
        this.tokenUri = 'no link';
      }

    }, error => {
      console.error(` getTokenizeEdition error : `, error);
    })
  }

  getHighestEditionNumber() {
    if (this.web3Srv.ethEnabled()) {
      this.web3Srv.call('highestEditionNumber').then(res => {
        this.highestEditionNumber = res;
      }, error => {
        console.error(` highestEditionNumber error :  `, error);
      })
    }
  }

  getDBHighestNumber() {
    this.editionSrv.highestNumber().subscribe(res => {
      console.log(` res getDBHighestNumber :  `, res);
      if (res["result"] == "successful") {
        this.highestDBEditionNumber = res['edition'];
        this.highestDBArtworkNumber = res['artwork'];
      }
      else {
        this.highestDBEditionNumber = -1;
        this.highestDBArtworkNumber = -1;
      }

    }, error => {
      this.highestDBEditionNumber = -1;
      this.highestDBArtworkNumber = -1;
      console.error(` getDBHighestNumber error :  `, error);
    })
  }

  updateFirstnumber() {
    this.editionSrv.updateHighestEditionNumber(this.newFirstnumber,
      this.edition.id,
      this.currentUser.id).subscribe(res => {
        console.log(` res getDBHighestNumber :  `, res);
        if (res["result"] == "successful") {
          this.toastSrv.showToast('Success',
            "updated Highest EditionNumber",
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            res['message'],
            this.toastSrv.iconClasses.error);
        }

      }, error => {
        console.error(` updateFirstnumber error :  `, error);
        this.toastSrv.showToast('Failed',
          error,
          this.toastSrv.iconClasses.error);
      })
  }

  generateArtwork() {
    try {
      this.editionSrv.generateArtwork(this.newArtWorkForm.value.artistId,
        this.newArtWorkForm.value.editionId,
        this.newArtWorkForm.value.name,
        this.newArtWorkForm.value.description,
        this.newArtWorkForm.value.tags,
        this.newArtWorkForm.value.isBid,
        this.newArtWorkForm.value.ethValue * 100,
        this.newArtWorkForm.value.image_type,
        this.newArtWorkForm.value.imageName,
        this.newArtWorkForm.value.imageUri,
        this.newArtWorkForm.value.totalamount,
        this.newArtWorkForm.value.firstnumber,
        this.currentUser.id).subscribe(res => {
          console.log(` res generateArtwork :  `, res);
          if (res["result"] == "successful") {
            this.toastSrv.showToast('Success',
              "updated Highest EditionNumber",
              this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('Failed',
              res['message'],
              this.toastSrv.iconClasses.error);
          }

        }, error => {
          console.error(` generateArtwork error :  `, error);
          this.toastSrv.showToast('Failed',
            error,
            this.toastSrv.iconClasses.error);
        })
    } catch (error) {
      console.error(` generateArtwork error :  `, error);
      this.toastSrv.showToast('Failed',
        error,
        this.toastSrv.iconClasses.error);
    }
  }

  updateStatus() {
    this.editionSrv.updateStatusByEditionId("1", this.currentUser.id, this.edition.id).subscribe(res => {
      if (res["result"] == "successful") {
        this.toastSrv.showToast('Success',
          "updated Status successfully",
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('Failed',
          res['message'],
          this.toastSrv.iconClasses.error);
      }
    }, error => {
      console.error(` updateStatus error : `, error);
      this.toastSrv.showToast('Failed',
        "update Status failed" + error,
        this.toastSrv.iconClasses.error);
    })
  }


  informArtist() {
    let id = this.newFirstnumber + 1;
    let domain = window.location.origin;
    let url = '/gallery/' + id;
    let link = domain + url;
    this.emailSrv.sendAvailableEmail(
      'Your artwork is available now on FormosArt',
      this.artist.name,
      this.artist.email,
      link,
      this.edition.artworkName,
      this.currentUser.id).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.toastSrv.showToast('Success', "Inform Email Sent", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });
  }
}
