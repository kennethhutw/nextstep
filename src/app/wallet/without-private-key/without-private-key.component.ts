import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-without-private-key",
  templateUrl: "./without-private-key.component.html",
  styleUrls: ["./without-private-key.component.css"],
})
export class WithoutPrivateKeyComponent implements OnInit {
  loading = false;
  constructor(private location: Location) {
    this.location = location;
  }

  onSubmit() {}
  ngOnInit() {}

  cancel() {
    this.location.back();
  }
}
