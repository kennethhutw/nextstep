import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  items = [{
    image: "https://ptetutorials.com/images/user-profile.png",
    name: "Sunil Rajput ",
    date: "1637490920390",
    message: "Test, which is a new approach to have all solutions astrology under one roof."
  },
  {
    image: "https://ptetutorials.com/images/user-profile.png",
    name: "Kenneth",
    date: "1637490920390",
    message: "AAAA."
  },
  {
    image: "https://ptetutorials.com/images/user-profile.png",
    name: "Ben",
    date: "1637490900390",
    message: "BBB."
  }];
  selectedItem = "Kenneth";
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {

  }

  onClick(item) {
    this.selectedItem = item.name;
  }
}
