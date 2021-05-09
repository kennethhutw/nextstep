import { Component, OnInit } from '@angular/core';
import { AuthStore } from './../../../_services';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  currentUser: any;
  userUid = "";
  constructor(private authStore: AuthStore,) {


  }

  ngOnInit() {
    this.currentUser = this.authStore.getUserData();
    console.log("uid", this.currentUser);
    if (this.currentUser != null) {
      this.userUid = this.currentUser.uid;
    }
  }

}
