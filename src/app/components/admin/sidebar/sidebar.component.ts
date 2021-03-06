import { Component, OnInit } from '@angular/core';
import { AuthStore } from './../../../_services/auth.store';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUser: any;
  userUid = "";
  constructor(
    private router: Router,
    private authStore: AuthStore,) {


  }

  ngOnInit() {
    this.currentUser = this.authStore.getUserData();
    if (this.currentUser != null) {
      this.userUid = this.currentUser.uid;
    }
  }

  logout() {
    this.authStore.logout();
    this.router.navigate(['./index'], {});
  }

}
