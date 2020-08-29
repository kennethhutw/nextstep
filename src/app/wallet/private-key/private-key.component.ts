import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-private-key",
  templateUrl: "./private-key.component.html",
  styleUrls: ["./private-key.component.css"],
})
export class PrivateKeyComponent implements OnInit {
  loading = false;
  constructor(private location: Location) {
    this.location = location;
  }

  ngOnInit() {}

  cancel() {
    this.location.back();
  }
}
