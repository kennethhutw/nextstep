import {
  HostListener, HostBinding,
  Component, OnInit
} from '@angular/core';
import {
  DialogService,
  ProjectService
} from './../../../_services';
import {
  AuthStore
} from "./../../../_services/auth.store";
@Component({
  selector: 'app-my-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class MyApplicationComponent implements OnInit {

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

}
