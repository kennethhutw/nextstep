import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: "app-main-layout",
  templateUrl: 'main-layout.component.html',
  styleUrls: ['main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, AfterViewInit {

  display = true;


  constructor(
    public router: Router
  ) {

    this.router.events.subscribe(event => {

      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }


  ngAfterViewInit() {
    window.scrollTo(0, 0)
  }

  ngOnInit() {


  }

  onActivate(event) {
    // window.scroll(0,0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
