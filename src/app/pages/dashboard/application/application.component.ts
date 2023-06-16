import {

  Component, OnInit
} from '@angular/core';
import {
  DialogService,
  ProjectService,
  DataService
} from './../../../_services';
import { Utility } from "./../../../_helpers";
import { TranslateService } from "@ngx-translate/core";
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
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
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

    this.currentUser = this.authStoreSrv.getUserData();
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }

  changeTab(tab) {
    this.currentTab = tab;
  }

}
