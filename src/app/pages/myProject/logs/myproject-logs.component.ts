import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ProjectService,
  ActivityService
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import {
  Utility
} from 'src/app/_helpers';
import { environment } from "../../../../environments/environment";
import { E } from '@angular/core/src/render3';
@Component({
  selector: 'app-myproject-logs',
  templateUrl: './myproject-logs.component.html',
  styleUrls: ['./myproject-logs.component.scss']
})
export class MyProjectLogComponent implements OnInit {

  currentUser;
  projectMsg = "";
  selectedUser = "";
  selectedOrder = "";
  members = [];
  displayItems: any[] = [];

  currentProject = null;
  constructor(
    private utilitySrv: Utility,
    private route: ActivatedRoute,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore,
    private activitySrv: ActivityService) {
  }

  ngOnInit() {

    this.currentUser = this.authStoreSrv.getUserData();
    let projectId = this.route.snapshot.paramMap.get("projectId");
    console.log("projectId =======", projectId)
    this.projectSrv.getProject(projectId,
      this.currentUser.id).then(res => {
        console.log("========", res)
        if (res['result'] === 'successful') {
          this.currentProject = res['data'];
          if (this.currentProject.logs.length > 0) {
            this.currentProject.logs.forEach(element => {
              if (!this.utilitySrv.IsNullOrEmpty(element.imageUrl)) {
                element.imageUrl = environment.assetUrl + element.imageUrl;
              }
              let isExist = this.members.filter(item => item.id == element.createdBy);
              if (isExist.length == 0) {
                this.members.push({
                  id: element.createdBy,
                  name: element.userName
                })
              }
            });

            this.displayItems = this.currentProject.logs;
          }
        }
      })

  }

  onSortChange(event) {
    if (event.target.value === "") {
      this.currentProject.logs.sort((a, b) => a.createdAt - b.createdAt);
    } else if (event.target.value === "old") {
      this.currentProject.logs.sort((a, b) => b.createdAt - a.createdAt);
    }

  }

  onUserChange(event) {
    if (event.target.value === "") {
      this.displayItems = this.currentProject.logs;;
    } else {
      this.displayItems = this.currentProject.logs.filter((log) => {
        return log.createdBy == event.target.value
      });
    }
  }

}
