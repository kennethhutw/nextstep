import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ProjectService
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
@Component({
  selector: 'app-myproject-logs',
  templateUrl: './myproject-logs.component.html',
  styleUrls: ['./myproject-logs.component.scss']
})
export class MyProjectLogComponent implements OnInit {

  currentUser;
  projectMsg = "";

  currentProject = null;
  constructor(
    private route: ActivatedRoute,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.currentUser = this.authStoreSrv.getUserData();
    let projectId = this.route.snapshot.paramMap.get("projectId");
    this.projectSrv.getProject(projectId,
      this.currentUser.id).then(res => {
        if (res['result'] === 'successful') {
          this.currentProject = res['data'];

        }
      })

  }



}
