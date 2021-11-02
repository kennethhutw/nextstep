import { Component, OnInit } from "@angular/core";
import { CryptoService } from "./_services";
import { Router, NavigationEnd } from '@angular/router';
import { environment } from "../environments/environment";
declare let gtag: Function;


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Formosa";
  constructor(public router: Router, private CryptoSrv: CryptoService) {


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
