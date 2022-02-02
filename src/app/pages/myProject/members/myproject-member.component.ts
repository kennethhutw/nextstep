import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,
  AuthStore,
  ProjectService
} from '../../../_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-myproject-member',
  templateUrl: './myproject-member.component.html',
  styleUrls: ['./myproject-member.component.css']
})
export class MyProjectMemberComponent implements OnInit {

  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentTab = "current";
  current = [];
  candidates = [];
  interviews = [];
  rejected = [];
  past = [];
  constructor(
    private route: ActivatedRoute,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    let projectId = this.route.snapshot.paramMap.get("projectId");
    this.projectSrv.getMembers(
      projectId
    ).then(res => {
      console.log("==============", res);
      if (res['result'] == 'successful') {
        let data = res['data'];

        if (data.length > 0) {
          this.current = data.filter((member) => {
            return member.status == 'current'
          });
          this.candidates = data.filter((member) => {
            return member.status == 'candidate'
          });
          this.interviews = data.filter((member) => {
            return member.status == 'interview'
          });
          this.rejected = data.filter((member) => {
            return member.status == 'rejected'
          });
          this.past = data.filter((member) => {
            return member.status == 'past'
          });

        }
      }
    })

  }

  changeTab(tab) {
    this.currentTab = tab;
  }

}
