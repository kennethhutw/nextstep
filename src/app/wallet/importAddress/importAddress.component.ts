import { Component, OnInit } from "@angular/core";
import { UserService } from "../../_services/user.service";

@Component({
  selector: "app-importAddress",
  templateUrl: "./importAddress.component.html",
  styleUrls: ["./../importwallet.component.css"],
})
export class ImportAddressComponent implements OnInit {
  users = [];
  loading = false;
  constructor(private userService: UserService) {

  }

  onSubmit() { }
  ngOnInit() {

  }
}
