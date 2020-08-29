import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-import-wallet',
  templateUrl: './import-wallet.component.html',
  styleUrls: ['./import-wallet.component.css']
})
export class ImportWalletComponent implements OnInit {

  constructor(private location: Location) {
    this.location = location;
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

}
