import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.users = this.userService.getAllUser();
  }

  OpenWallet(user){
    console.log("OpenWallet : ", user);
    this.router.navigate(["./wallet/walletlist"], {
      queryParams: {
        uid: user["id"]
      }
    });
  }

}
