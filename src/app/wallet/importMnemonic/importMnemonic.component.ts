import { Component, OnInit } from "@angular/core";
import { UserService } from "../../_services/user.service";

@Component({
  selector: "app-importMnemonic",
  templateUrl: "./importMnemonic.component.html",
  styleUrls: ["./../importwallet.component.css"],
})
export class ImportMnemonicComponent implements OnInit {
  users = [];
  loading = false;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getAllUser();
  }
}
