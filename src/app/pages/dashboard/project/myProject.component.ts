import { ViewEncapsulation, Component, OnInit } from '@angular/core';

import {
  DialogService,
  ProjectService,
  ToastService
} from './../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";

@Component({
  selector: 'app-my-project',
  templateUrl: './myProject.component.html',
  styleUrls: ['./myProject.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    private toastSrv: ToastService,
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
  onClickDelete($event, project) {
    //Are you sure you want to delete
    this.dialogSrv.confirmThis("你確定要刪除此專案 -[" + project.name + "]嗎? ",
      () => {
        console.log("yed ===");
        this.projectSrv.delete(project.id, this.currentUser.id).then(res => {
          if (res['result'] == "successful") {

            this.publishedprojects = this.publishedprojects.filter(obj => {
              return obj.id !== project.id
            })
            this.draftedprojects = this.draftedprojects.filter(obj => {
              return obj.id !== project.id
            })
            this.toastSrv.showToast('Success',
              " " + project.name + "已刪除.",
              this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('Failed',
              res['message'],
              this.toastSrv.iconClasses.error);
          }
        }, (error) => {
          console.log("error", error);
        })
      }, () => {
        console.log("No ----");
      });
  }


}
