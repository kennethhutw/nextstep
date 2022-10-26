import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "./../../_services";
import { Utility } from "./../../_helpers";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: [
    "./about.component.scss",
  ]
})
export class AboutComponent implements OnInit {

  private fragment: string;

  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private route: ActivatedRoute
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
    this.route.fragment.subscribe(fragment => {
      console.log("fragment =========", fragment)
      this.fragment = fragment;
    });
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
      scroll(this.fragment.toString())
    } catch (e) { }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
