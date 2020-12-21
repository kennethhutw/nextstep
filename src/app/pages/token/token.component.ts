import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-token",
  templateUrl: "./token.component.html",
  styleUrls: ["./token.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TokenComponent implements OnInit {
  constructor(private translateSrv: TranslateService) {
    /*  this.translateSrv.setTranslation("zh-tw", {
      HELLO: "你好",
    });
    this.translateSrv.setTranslation("en", {
      HELLO: "Hello",
    }); */
  }

  ngOnInit() {
   // this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }
}
