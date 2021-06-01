import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CryptoService, Web3Service } from "../../_services";
// https://www.npmjs.com/package/an-qrcode
@Component({
  selector: "app-donation",
  templateUrl: "./donation.component.html",
  styleUrls: ["./donation.component.css"],
})
export class DonationComponent implements OnInit {
  AmountGroup: FormGroup;
  qrcodevalue: string;
  submitted = false;
  loading = false;
  btcRate: number;
  ethRate: number;
  usdvalue: number = 0;
  tokenvalue: number = 0;
  qty: number = 1;
  tokenunit: string;
  userAccount: string;
  bubbleAmount: number = 1;
  standardUSDPrice: number = 3.5;
  standardEtherPrice: number;
  supportAmount: string;
  eth = "ethereum:0x83F861941E940d47C5D53B20141912f4D13DEe64";
  //trus wallet
  btc = "bitcoin:bc1qy5vl5xpygpts77w5qxw5mel7ttg0j39yfecszw";

  constructor(
    private formBuilder: FormBuilder,
    private CryptoSrv: CryptoService,
    private web3Srv: Web3Service
  ) { }
  ngOnInit() {
    this.tokenunit = "btc";
    this.qrcodevalue =
      "ethereum:0x83F861941E940d47C5D53B20141912f4D13DEe64?amount=25";
    this.AmountGroup = this.formBuilder.group({
      amount: [null],
    });
    this.CryptoSrv.getCrypto("btc").then(
      (data) => {
        var eth = data["data"].filter((r) => r.id == "ethereum");
        var btc = data["data"].filter((r) => r.id == "bitcoin");

        this.ethRate = this.roundToTwo(eth[0].priceUsd, 2);
        this.btcRate = this.roundToTwo(btc[0].priceUsd, 2);
        this.standardEtherPrice =
          this.standardUSDPrice * this.roundToTwo(1 / this.ethRate, 3);
        this.supportAmount =
          this.standardEtherPrice.toString() +
          " ETH ≈ US$ " +
          this.standardUSDPrice.toString();
      },
      (error) => {
        console.log("getCrypto error", error);
      }
    );

    this.web3Srv.getAccountDetail().then(
      (data) => {
        this.userAccount = data.address;
      },
      (error) => {
        console.log("getAccountDetail error", error);
      }
    );
  }

  roundToTwo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

  AmountChanged() {
    this.supportAmount =
      (this.standardEtherPrice * this.bubbleAmount).toString() +
      " ETH  ≈ US$ " +
      (this.standardUSDPrice * this.bubbleAmount).toString();
  }

  buybubbletea(amount: number) {
    this.bubbleAmount = amount;
    this.supportAmount =
      (this.standardEtherPrice * amount).toString() +
      " ETH  ≈ US$ " +
      (this.standardUSDPrice * amount).toString();
  }
  donate() {
    var _amount = this.bubbleAmount * this.standardEtherPrice;
    var res = this.web3Srv.transferEther(
      "0xF5d37bfEF05C2c411Feff9536d439b3ff3fB4f59",
      this.userAccount,
      _amount
    );

    res.then(function (receipt) {
      console.log("txid", receipt);
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    if (this.AmountGroup.invalid) {
      return;
    }
    var crypto = this.qrcodevalue.split("?");
    this.loading = false;
    this.submitted = false;
    this.tokenvalue = this.AmountGroup.value.amount;
    this.qrcodevalue = crypto[0] + "?Amount=" + this.AmountGroup.value.amount;
    this.AmountGroup.value.amount = null;
    this.AmountGroup.reset();

    switch (this.tokenunit) {
      case "btc":
        this.qrcodevalue = this.btc;
        if (this.tokenvalue > 0) {
          this.usdvalue = this.tokenvalue * this.btcRate;
        }
        break;
      case "ether":
        this.qrcodevalue = this.eth;
        if (this.tokenvalue > 0) {
          this.usdvalue = this.tokenvalue * this.ethRate;
        }
        break;
      default:
        this.qrcodevalue = this.eth;
        if (this.tokenvalue > 0) {
          this.usdvalue = this.tokenvalue;
        }
        break;
    }
  }
  getAccount() {
    this.web3Srv.getAccountDetail().then(
      (data) => {
        console.log("User", data);
      },
      (error) => {
        console.log("CreateInDB error", error);
      }
    );
  }
  CryptoSelector_change(value) {
    // const val1 = this.filterForm.value;
    // const value = event.target.value;
    // this.selected = value;
    this.qrcodevalue = this.eth;
    this.tokenunit = value;
    switch (value) {
      case "btc":
        this.qrcodevalue = this.btc;
        if (this.tokenvalue > 0) {
          this.usdvalue = this.tokenvalue * this.btcRate;
        }
        break;
      case "ether":
        this.qrcodevalue = this.eth;
        if (this.tokenvalue > 0) {
          this.usdvalue = this.tokenvalue * this.ethRate;
        }
        break;
      default:
        this.qrcodevalue = this.eth;
        if (this.tokenvalue > 0) {
          this.usdvalue = this.tokenvalue;
        }
        break;
    }
    /*   this.qrcodevalue = value;
      console.log("CryptoSelector_change", value); */
  }

  plus() {
    this.qty += 1;
  }

  minus() {
    this.qty -= 1;
  }
}
