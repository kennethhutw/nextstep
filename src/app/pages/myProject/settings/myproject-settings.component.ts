import { Component, OnInit } from '@angular/core';

import {
  DialogService,
  ProjectService
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-myproject-settings',
  templateUrl: './myproject-settings.component.html',
  styleUrls: ['./myproject-settings.component.scss']
})
export class MyProjectSettingsComponent implements OnInit {

  isPublic: boolean = false;
  isShowMember: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  msg = "";
  currentProject = null;
  constructor(
    private route: ActivatedRoute,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    let projectId = this.route.snapshot.paramMap.get("projectId");
    this.projectSrv.getProject(projectId, this.currentUser.id).then(res => {
      if (res['result'] === 'successful') {
        this.currentProject = res['data'];
        this.isPublic = this.currentProject.isPublic;
        this.isShowMember = this.currentProject.isShowMember;
      }
    }).catch(error => {
      console.error("error", error);
    })

  }

  onSave() {
    this.msg = "";
    this.projectSrv.update(this.currentProject.id, {
      isPublic: this.isPublic,
      isShowMember: this.isShowMember
    }).subscribe(res => {
      if (res['result'] === 'successful') {
        this.msg = "Update successfully.";
      } else {
        this.msg = "Update failed.";
      }
    }, error => {
      this.msg = "Update failed.";
      console.error("updated error", error);
    })
  }

}
