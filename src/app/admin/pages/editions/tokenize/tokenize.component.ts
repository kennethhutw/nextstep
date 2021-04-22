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
  Web3Service
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
  editedUser: any;
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
  constructor(
    private utility: Utility,
    private formBuilder: FormBuilder,
    private authStoreSrv: AuthStore,
    private editionSrv: EditionService,
    private emailSrv: EmailService,
    private toastSrv: ToastService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
    private web3Srv: Web3Service
  ) { }

  ngOnInit() {
    // 0x0000000000000000000000000000000000000000000000000000000000000000
    this.currentUser = this.authStoreSrv.getUserData();

    this.tokenizeForm = this.formBuilder.group({
      editionNumber: [""],
      editionData: "0x0000000000000000000000000000000000000000000000000000000000000000",
      editionType: 0,
      startDate: [""],
      endDate: [""],
      artistAccount: [""],
      artistCommission: 0,
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
      usdValue: [""],
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
    })
  }

  ngAfterViewInit(): void {

  }

  CheckStatus(value) {
    console.log(" ===========", value);
    let _status = "not decide";
    switch (value) {
      case "1":
        _status = "approved";
        break;
      case 2:
        _status = "rejected";
        break;

    }
    return _status;
  }

  ngOnDestroy(): void {

  }

  initEdition(id) {
    try {
      this.editionSrv.getTokenizeEdition(id).subscribe(res => {
        console.log(` getEdition ${res}`, res);
        if (res['result'] == 'successful') {
          this.edition = res['data'];
          // if (this.editions.length > 0) {
          //   this.editions.forEach((element) => {
          //     element.imageUrl = environment.assetUrl + element.imageUrl;
          //   });
          // }

          this.assetImgUrl = environment.assetUrl + this.edition.imageUrl;
          let _eth = this.utility.getSellETHPrice(this.edition.usdValue);
          this.tokenizeForm.setValue({
            editionNumber: this.edition.firstnumber,
            editionData: "0x0000000000000000000000000000000000000000000000000000000000000000",
            editionType: 0,
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
            external_uri: link,
            imageUri: "./.." + this.edition.imageUrl,
          });

          /*
                editionId: [""],
      artistId: [""],
      name: [""],
      description: [""],
      usdprice: [""],
      tags: [""],
      isBid: [""],
      asset_type: [""],
      imageName: [""],
      imageUri: [""],
      totalamount: [""],
      firstnumber: [""],*/

          this.newArtWorkForm.setValue({
            artistId: this.edition.artistId,
            editionId: this.edition.id,
            name: this.edition.artworkName,
            description: this.edition.description,
            usdValue: this.edition.usdValue,
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
        console.error(` get initEdition : ${error} `);

      })
    } catch (error) {

    }
  }



  sendApprovedEmail() {
    let domain = window.location.origin;
    let url = '/setPassword';
    let link = domain + url;
    this.emailSrv.sendapprovedEmail(
      this.editedUser.id,
      'FormosArt Artist Application',
      this.editedUser.name,
      this.editedUser.email,
      link,
      this.currentUser.id).subscribe(sendRes => {
        if (sendRes['result'] == "successful") {
          this.toastSrv.showToast('Success', "Approved Email Sent", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });
  }

  onClear() {

  }

  Tokenize() {
    if (this.web3Srv.ethEnabled()) {

      var unixtimestamp = (new Date(this.tokenizeForm.value.startDate)).getTime() / 1000;
      console.log('ethEnabled ==========');
      let priceInWei = this.web3Srv.EthToWei(this.tokenizeForm.value.priceInEth.toString());
      if (this.web3Srv.loadContract()) {
        this.web3Srv.executeTransaction('createActiveEdition',
          this.tokenizeForm.value.editionNumber,
          this.tokenizeForm.value.editionData,
          this.tokenizeForm.value.editionType,
          unixtimestamp,
          0,
          this.tokenizeForm.value.artistAccount,
          this.tokenizeForm.value.artistCommission,
          priceInWei,
          this.tokenizeForm.value.tokenURI,
          this.tokenizeForm.value.totalAvailable
        ).then(res => {
          console.log('res ==========', res);
        }).catch(err => {
          console.error('name err ==========', err);
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
      } else {
        this.tokenUri = res['message'];
      }

    }, error => {
      console.error(` res error : ${error} `);
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
      console.error(` res error : ${error} `);
    })
  }

  getHighestEditionNumber() {
    if (this.web3Srv.ethEnabled()) {
      this.web3Srv.call('highestEditionNumber').then(res => {
        this.highestEditionNumber = res;
      }, error => {
        console.error(` highestEditionNumber error : ${error} `);
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
      console.error(` res error : ${error} `);
    })
    // highestDBEditionNumber = -1;
    // highestDBArtworkNumber = -1;
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
        console.error(` res error : ${error} `);
        this.toastSrv.showToast('Failed',
          error,
          this.toastSrv.iconClasses.error);
      })
  }

  generateArtwork() {
    try {
      // artistId,
      //   editionId,
      //   name,
      //   description,
      //   tags,
      //   isBid,
      //   usdprice,
      //   imageName,
      //   imageUrl,
      //   totalamount,
      //   firstnumber,
      //   uid
      console.log("generateArtwork ======", this.newArtWorkForm.value)
      this.editionSrv.generateArtwork(this.newArtWorkForm.value.artistId,
        this.newArtWorkForm.value.editionId,
        this.newArtWorkForm.value.name,
        this.newArtWorkForm.value.description,
        this.newArtWorkForm.value.tags,
        this.newArtWorkForm.value.isBid,
        this.newArtWorkForm.value.usdValue,
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
          console.error(` res error : ${error} `);
          this.toastSrv.showToast('Failed',
            error,
            this.toastSrv.iconClasses.error);
        })
    } catch (error) {
      console.error(` res error : ${error} `);
      this.toastSrv.showToast('Failed',
        error,
        this.toastSrv.iconClasses.error);
    }
  }
}
