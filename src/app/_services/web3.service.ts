import { Injectable, NgZone } from "@angular/core";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Observable } from "rxjs";

const contractAbi = require("./contractABI.json");
declare var window: any;

@Injectable({
  providedIn: "root",
})
export class Web3Service {
  private web3: Web3;
  private contract: any;
  private contractAddress = "0x8Cad66326e9c72C87971f3b945f15bE6A43bC4dD";
  constructor(private zone: NgZone) {
    // if (window.web3) {
    //   this.web3 = new Web3(window.ethereum);
    //   this.contract = new this.web3.eth.Contract(
    //     contractAbi,
    //     this.contractAddress
    //   );
    //   window.ethereum.enable().catch((err) => {
    //     console.log(err);
    //   });
    // } else {
    //   console.warn("Metamask not found Install or enable Metamask");
    // }


  }

  ethEnabled() {
    if (window.web3) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(
        contractAbi,
        this.contractAddress
      );
      window.ethereum.enable().catch((err) => {
        console.error(err);
      });

      return true;
    }
    return false;
  }

  loadContract() {
    if (this.web3) {
      this.contract = new this.web3.eth.Contract(
        contractAbi,
        this.contractAddress
      );
      return true;
    }
    return false;
  }

  async getAccountDetail(): Promise<any> {

    var accounts = await this.web3.eth.getAccounts();
    var balance = await this.web3.eth.getBalance(accounts[0]);
    var networkId = await this.web3.eth.net.getId();
    return {
      address: accounts[0],
      balance: this.web3.utils.fromWei(balance, "ether"),
      networkId: networkId,
    };
  }

  async getAccount(): Promise<string> {
    return this.web3.eth.getAccounts().then((accounts) => accounts[0] || "");
  }

  async executeTransaction(fnName: string, ...args: any[]): Promise<void> {
    const acc = await this.getAccount();
    return this.contract.methods[fnName](...args).send({ from: acc });
  }

  async purchase(fnName: string, ethValue, ...args: any[]): Promise<void> {
    const acc = await this.getAccount();
    return this.contract.methods[fnName](...args).send({ from: acc, value: ethValue });
  }

  async call(fnName: string, ...args: any[]) {
    const acc = await this.getAccount();
    return this.contract.methods[fnName](...args).call({ from: acc });
  }

  async transferEther(receiver: string, sender: string, value: number) {
    return this.web3.eth.sendTransaction({
      to: receiver,
      from: sender,
      value: this.web3.utils.toWei(value.toString(), "ether"),
    });
  }

  getNetworkId() {
    return this.web3.eth.net.getId();
  }

  EthToWei(value) {
    return this.web3.utils.toWei(value, 'ether');
  }
  verifyEthAddress(address) {
    return this.web3.utils.isAddress(address);
  }

  onEvents(event: string) {
    return new Observable((observer) => {
      this.contract.events[event]().on("data", (data) => {
        // THIS MUST RUN INSIDE ANGULAR ZONE AS IT'S LISTENING FOR 'ON'
        this.zone.run(() => {
          observer.next({
            event: data.event,
            payload: data.returnValues,
          });
        });
      });
    });
  }
}
