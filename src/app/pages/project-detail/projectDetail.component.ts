import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,
  ProjectService
} from '../../_services';
import {
  AuthStore
} from "../../_services/auth.store";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-my-project-detail',
  templateUrl: './projectDetail.component.html',
  styleUrls: ['./projectDetail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

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

}
