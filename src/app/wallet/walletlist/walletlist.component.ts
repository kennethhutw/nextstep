import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../_services';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'walletlist',
  templateUrl: './walletlist.component.html',
  styleUrls: ['./walletlist.component.css']
})
export class WalletListComponent implements OnInit {
  wallets = [];

  constructor(
    private router: Router,
    private walletSrv: WalletService,
    private route: ActivatedRoute)
    {

     }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let uid = params["uid"];
      var walletPromise = this.walletSrv.getWalletByUid(uid);
      for (let i in walletPromise) {
        this.wallets.push(walletPromise[i])
      }
      console.log("wallettsss", this.wallets);
    });
  }

  clear(){
    this.wallets =[];
  }

}
