import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { resResult } from "../_models";
import { forEach } from "@angular/router/src/utils/collection";
import { environment } from "./../environments/environment";

@Injectable()
export class WalletService {
  fakeWalletData = [
    {
      id: "0001",
      address: "35M4nosxb24cca6j4y7saeyfmDu9kLyZYe",
      amount: "10",
      cointype: "BTC",
    },
    {
      id: "0002",
      address: "35M4nosxb24cca6j4y7saeyfmDu9kLyZYe",
      amount: "10",
      cointype: "BTC",
    },
    {
      id: "0001",
      address: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      amount: "10.5",
      cointype: "ETH",
    },
    {
      id: "0001",
      address: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      amount: "10.5",
      cointype: "BNB",
    },
    {
      id: "0002",
      address: "0xd05cB2b16468B30F97fF51781052985439496014",
      amount: "0.44",
      cointype: "ETH",
    },
    {
      id: "0003",
      address: "0x2844b5172e962032e02b8Ae88553B89BC8920c18",
      amount: "12",
      cointype: "ETH",
    },
  ];

  fakeTxData = [
    {
      from: "0xd05cB2b16468B30F97fF51781052985439496014",
      to: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      value: "10",
      timestamp: "1556872224409",
      fee: "0.02",
      cointype: "ETH",
    },
    {
      from: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      to: "0xd05cB2b16468B30F97fF51781052985439496014",
      value: "2",
      timestamp: "1556872233409",
      fee: "0.02",
      cointype: "ETH",
    },
    {
      from: "0xd05cB2b16468B30F97fF51781052985439496014",
      to: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      value: "1",
      timestamp: "1556872224450",
      fee: "0.12",
      cointype: "ETH",
    },
    {
      from: "0x2844b5172e962032e02b8Ae88553B89BC8920c18",
      to: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      value: "10",
      timestamp: "1556872224409",
      fee: "0.02",
      cointype: "BNB",
    },
    {
      from: "0xd05cB2b16468B30F97fF51781052985439496014",
      to: "0x2844b5172e962032e02b8Ae88553B89BC8920c18",
      value: "1",
      timestamp: "1556872224409",
      fee: "0.02",
      cointype: "ETH",
    },
    {
      from: "0xd05cB2b16468B30F97fF51781052985439496014",
      to: "0x2844b5172e962032e02b8Ae88553B89BC8920c18",
      value: "3",
      timestamp: "1556872224409",
      fee: "0.02",
      cointype: "ETH",
    },
    {
      from: "0x2844b5172e962032e02b8Ae88553B89BC8920c18",
      to: "0x9EAa3CD710CCFE10FC4047a8102271893E4ec938",
      value: "2",
      timestamp: "1556872224409",
      fee: "0.02",
      cointype: "BNB",
    },
  ];

  fakeCoinTypeData = ["BTC", "ETH", "BNB"];

  constructor(private http: HttpClient) {}

  async getWalletByUid(uid: string) {
    let params = new HttpParams().set("uid", uid);
    let _resResult = await this.http
      .get<resResult>(`${environment.apiUrl}/wallet/getDataByUid`, {
        params: params,
      })
      .toPromise();

    if ((_resResult.result = "successful")) {
      return _resResult.data;
    } else {
      return null;
    }
  }

  getTransactionDataByWallet(wallet) {
    let transactionList = [];
    console.log(wallet);
    for (let i = 0; i < this.fakeTxData.length; i++) {
      const transaction = this.fakeTxData[i];
      if (
        (transaction.from == wallet.address ||
          transaction.to == wallet.address) &&
        wallet.cointype == transaction.cointype
      ) {
        transactionList.push(transaction);
      }
    }
    return transactionList;
  }

  async getCoinTypeData() {
    let _resResult = await this.http
      .get<resResult>(
        "http://cryptopaymentserver.herokuapp.com/cointype/getAllCoin"
      )
      .toPromise();

    return _resResult.data;
  }

  async checkAccount() {
    let _resResult = await this.http
      .get<resResult>(
        "https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=XSZH5F6XQ5WE6U1UVINV3AWGDZC1R6EYWG"
      )
      .toPromise();

    return _resResult.data;
  }
}
