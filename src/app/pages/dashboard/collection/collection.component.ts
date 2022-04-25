import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,
  ProjectService,
  LikeService
} from './../../../_services';
import {
  AuthStore
} from "./../../../_services/auth.store";
@Component({
  selector: 'app-my-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class MyCollectionComponent implements OnInit {

  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentTab = "project";
  projects = [];
  partners = [];
  mentors = [];

  constructor(
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore,
    private likeSrv: LikeService) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.likeSrv.getCollection(
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        let data = res['data'];
        if (data.length > 0) {
          this.projects = data.filter((collection) => {
            return collection.likedType == 'project'
          });
          this.partners = data.filter((collection) => {
            return collection.likedType == 'partner'
          });
          this.mentors = data.filter((collection) => {
            return collection.likedType == 'mentor'
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
