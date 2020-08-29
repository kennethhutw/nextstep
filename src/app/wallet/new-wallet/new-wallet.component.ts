import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../_services';
import { Router } from "@angular/router";

@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.css']
})
export class NewWalletComponent implements OnInit {
  coinTypes = [];

  constructor(
    private walletSrv: WalletService,
    private router: Router) { }

  ngOnInit() {
    var coinTypesPromise = this.walletSrv.getCoinTypeData().then(result => {

      if (result) {
        var coinTypeList = [];
        for(let index in result) {
          coinTypeList.push(result[index].symbol);
          console.log(coinTypeList);
          this.coinTypes = coinTypeList;
        }
      }

      return result;
    });

  

  }

  cancel() {
    this.router.navigate(["/userpage"]);
  }

}
