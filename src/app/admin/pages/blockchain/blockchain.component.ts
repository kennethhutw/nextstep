import { Component, OnInit } from '@angular/core';
import {
  Web3Service,
  AuthStore,
} from './../../../_services';
import { EditionDetailModel } from "./../../../_models";

import { Utility } from "./../../../_helpers";
@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {

  tokenName = "";
  highestEditionNumber = 0;
  totalNumberMinted = 0;
  totalNumberAvailable = 0;
  faCommissionAccount = 0;
  totalSupply = 0;
  isConnected = false;
  owner = "";
  tokenId = "";
  EditionDetail: EditionDetailModel;
  constructor(
    private utility: Utility,
    private web3Srv: Web3Service,
    private authStore: AuthStore,
  ) { }

  ngOnInit() {
    if (this.web3Srv.ethEnabled()) {
      this.isConnected = true;
      console.log('ethEnabled ==========');
      if (this.web3Srv.loadContract()) {
        this.web3Srv.call('name').then(res => {
          console.log('res ==========', res);
          this.tokenName = res;
        }).catch(err => {
          console.error('name err ==========', err);
        });

        this.web3Srv.call('owner').then(res => {
          console.log('res owner ==========', res);
          this.owner = res;
        }).catch(err => {
          console.error('owner err ==========', err);
        });

        this.web3Srv.call('highestEditionNumber').then(res => {
          console.log('res ==========', res);
          this.highestEditionNumber = res;
        }).catch(err => {
          console.error('highestEditionNumber err ==========', err);
        });

        this.web3Srv.call('totalNumberMinted').then(res => {
          console.log('res ==========', res);
          this.totalNumberMinted = res;
        }).catch(err => {
          console.error('totalNumberMinted err ==========', err);
        });

        this.web3Srv.call('totalNumberAvailable').then(res => {
          console.log('res ==========', res);
          this.totalNumberAvailable = res;
        }).catch(err => {
          console.error('totalNumberAvailable err ==========', err);
        });

        this.web3Srv.call('faCommissionAccount').then(res => {
          console.log('res ==========', res);
          this.faCommissionAccount = res;
        }).catch(err => {
          console.error('faCommissionAccount err ==========', err);
        });

        this.web3Srv.call('totalSupply').then(res => {
          console.log('res ==========', res);
          this.totalSupply = res;
        }).catch(err => {
          console.error('totalSupply err ==========', err);
        });
      }
    }
  }

  getTokenDetail() {
    if (!this.utility.IsNullOrEmpty(this.tokenId)) {
      this.web3Srv.call('detailsOfEdition', this.tokenId).then(res => {
        console.log('detailsOfEdition res ==========', res);
        this.EditionDetail = new EditionDetailModel(res[0],
          res[1],
          res[2],
          res[3],
          res[4],
          res[5],
          res[6],
          res[7],
          res[8],
          res[9],
          res[10],
          res['_active'],
          res['_artistAccount'],
          res['_artistCommission'],
          res['_editionData'],
          res['_editionType'],
          res['_endDate'],
          res['_priceInWei'],
          res['_startDate'],
          res['_tokenURI'],
          res['_totalAvailable'],
          res['_totalSupply']);
        console.log('detailsOfEdition res ==========', this.EditionDetail);
      }).catch(err => {
        console.error('detailsOfEdition err ==========', err);
      });
    }
  }

}
