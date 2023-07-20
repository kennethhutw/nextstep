import { Component, OnInit } from "@angular/core";

import { Router, NavigationEnd } from '@angular/router';
import { environment } from "../environments/environment";
declare let gtag: Function;


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Next Step";
  constructor(public router: Router) {


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let url = event.urlAfterRedirects.split('?')[0];
        if (event.urlAfterRedirects.includes('/post/')) {
          url = event.urlAfterRedirects;
        }

        if (typeof gtag !== 'undefined' && environment.gtag != '') {
          gtag('config', environment.gtag,
            {
              'page_path': url
            }
          );
        }

      }
    });
  }
}
