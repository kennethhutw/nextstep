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

    this.CryptoSrv.getETHPrice().subscribe(res => {
      if (res) {
        localStorage.setItem("ETHPRICE", res.toString());
      }
    });

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
        // if (user) {
        //   if (typeof gtag !== 'undefined') {
        //     gtag('config', 'UA-171395439-1',
        //       {
        //         'page_path': url,
        //       }
        //     );
        //     gtag('set', { 'user_id': user.id }); // Set the user ID using signed-in user_id.
        //     gtag('event', 'sign_in', { 'send_to': 'agency' });
        //   }

        // } else {
        //   if (typeof gtag !== 'undefined') {
        //     gtag('config', 'UA-171395439-1',
        //       {
        //         'page_path': url
        //       }
        //     );
        //   }
        // }
      }
    });
  }
}
