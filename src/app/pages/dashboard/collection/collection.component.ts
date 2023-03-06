import { HostListener, HostBinding, Component, OnInit } from '@angular/core';

import {
  DialogService,
  ProjectService,
  ViewsService
} from './../../../_services';
import {
  AuthStore
} from "./../../../_services/auth.store";
import {
  Utility
} from './../../../_helpers';
@Component({
  selector: 'app-my-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class MyCollectionComponent implements OnInit {

  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentTab = "project";
  projects = [];
  partners = [];
  applications = [];
  mentors = [];

  constructor(
    private dialogSrv: DialogService,
    private utilitySrv: Utility,
    private authStoreSrv: AuthStore,
    private viewSrv: ViewsService) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.viewSrv.getCollect(
      this.currentUser.id
    ).then(res => {
      console.log("================", res);
      if (res['result'] == 'successful') {
        this.projects = res['projects'];
        if (this.projects.length > 0) {
          this.projects.forEach(element => {
            element.isSelected = true;
            if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
          });
        }


        this.partners = res['users'];
        if (this.partners.length > 0) {
          this.partners.forEach(element => {
            element.isSelected = true;
            if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
            if (!this.utilitySrv.IsNullOrEmpty(element.interested)) {
              element.interested = element.interested.split(',');
            }
          });
        }
        this.applications = res['applications'];
        if (this.applications.length > 0) {
          this.applications.forEach(element => {
            element.isSelected = true;
            if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
          });
        }
        this.mentors = res['mentors'];
        if (this.mentors.length > 0) {
          this.mentors.forEach(element => {
            element.isSelected = true;
            if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
              element.skills = element.skills.split(',');
            }
            if (!this.utilitySrv.IsNullOrEmpty(element.interested)) {
              element.interested = element.interested.split(',');
            }
          });
        }
      }
    })

  }

  changeTab(tab) {
    this.currentTab = tab;
  }

  onClickDelete(event) { }

}
