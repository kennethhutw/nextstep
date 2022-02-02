import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,
  AuthStore,
  ProjectService
} from './../../_services';

@Component({
  selector: 'app-my-project',
  templateUrl: './myProject.component.html',
  styleUrls: ['./myProject.component.css']
})
export class MyProjectComponent implements OnInit {

  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentTab = "published";
  publishedprojects = [];
  draftedprojects = [];
  constructor(
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
  }

  ngOnInit() {

    this.currentUser = this.authStoreSrv.getUserData();
    this.projectSrv.getProjectsByUid(
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let data = res['data'];
        console.log("data =========", data);
        if (data.length > 0) {
          this.publishedprojects = data.filter((project) => {
            return project.status == 'published'
          });
          this.draftedprojects = data.filter((project) => {
            return project.status == 'draft'
          });

        }
      }
    })

  }

  changeTab(tab) {
    this.currentTab = tab;
  }
  onClickDelete($event) {
    this.dialogSrv.confirmThis("Are you sure you want to delete ",
      () => {
        console.log("yed ===");
      }, () => {
        console.log("No ----");
      });
  }
}
