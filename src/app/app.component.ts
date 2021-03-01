import { Component, OnInit } from "@angular/core";
import { CryptoService } from "./_services";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Formosa";
  constructor(private CryptoSrv: CryptoService) {

    this.CryptoSrv.getETHPrice().subscribe(res => {
      if (res) {
        localStorage.setItem("ETHPRICE", res.toString());
      }
    });

  }
}
