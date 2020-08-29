import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

import Web3 from "web3";

declare let window: any;

@Component({
  selector: "app-metamask",
  templateUrl: "./metamask.component.html",
  styleUrls: ["./metamask.component.css"],
})
export class MetamaskComponent implements OnInit {
  form: FormGroup;
  loading = false;
  //web3
  private _web3: any;
  private _address = new FormControl("", Validators.required);
  private _note: string = null;

  constructor(private location: Location, private fb: FormBuilder) {
    this.location = location;
    this.form = fb.group({
      address: this._address,
      note: this._note,
    });
  }

  ngOnInit() {}

  cancel() {
    this.location.back();
  }

  async connectMetaMask() {
    if (typeof window.web3 !== "undefined") {
      this._web3 = new Web3(window.web3.currentProvider);
      console.log("MetaMask is installed");
      var accounts = await this._web3.eth.getAccounts();
      this._address = accounts[0];
      this.form.setValue({ address: this._address, note: "" });
      console.log("_address" + this._address);
    } else {
      console.log("MetaMask is not installed");
    }
  }
}
