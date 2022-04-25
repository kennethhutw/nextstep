import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,

  ProjectService
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
@Component({
  selector: 'app-myproject-logs',
  templateUrl: './myproject-logs.component.html',
  styleUrls: ['./myproject-logs.component.css']
})
export class MyProjectLogComponent implements OnInit {

  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentTab = "published";
  logs = [
    { content: "Create project", name: "Kenneth", date: "1641900608" },
    { content: "update profile", name: "Dan", date: "1621900608" },
    { content: "add Member", name: "Kitty", date: "1641880608" },
    { content: "reject application", name: "Alice", date: "1641780608" }
  ];
  draftedprojects = [];
  constructor(
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    // this.projectSrv.getProjectsByUid(
    //   this.currentUser.id
    // ).then(res => {
    //   if (res['result'] == 'successful') {
    //     let data = res['data'];
    //     console.log("data =========", data);
    //     if (data.length > 0) {
    //       this.publishedprojects = data.filter((project) => {
    //         return project.status == 'published'
    //       });
    //       this.draftedprojects = data.filter((project) => {
    //         return project.status == 'draft'
    //       });

    //     }
    //   }
    // })

  }

  changeTab(tab) {
    this.currentTab = tab;
  }

}
