import { Component, OnInit } from '@angular/core';

import {
  DialogService,
  ProjectService,
  ToastService,
  ConfirmDialogService
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
    private toastSrv: ToastService,
    private confirmDialogSrv: ConfirmDialogService,
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

  onPublicChange(event) {
    this.projectSrv.updatePublic(this.currentProject.id,
      this.isPublic ? 1 : 0, this.currentUser.id).then(res => {
        if (res['result'] === 'successful') {
          this.toastSrv.showToast('顯示專案',
            "更新成功 ",
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('顯示專案',
            "更新失敗 ",
            this.toastSrv.iconClasses.error);
        }
      }).catch(error => {
        this.toastSrv.showToast('顯示專案',
          "更新失敗 ",
          this.toastSrv.iconClasses.error);
        console.error("updated error", error.message);
      })
  }

  onMemberChange(event) {
    this.projectSrv.updatePublicMember(this.currentProject.id,
      this.isShowMember ? 1 : 0,
      this.currentUser.id).then(res => {
        if (res['result'] === 'successful') {

          this.toastSrv.showToast('顯示專案成員',
            "更新成功 ",
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('顯示專案成員',
            "更新失敗 ",
            this.toastSrv.iconClasses.error);
        }
      }).catch(error => {
        this.toastSrv.showToast('顯示專案成員',
          "更新失敗 ",
          this.toastSrv.iconClasses.error);
        console.error("updated error", error.message);
      })
  }

  onDeleteProject() {

    this.dialogSrv.deleteThis('確定刪除此專案', '此動作將無法復原', () => {
      this.projectSrv.delete(this.currentProject.id,
        this.currentUser.id).then(res => {
          if (res['result'] === 'successful') {
            this.msg = "Update successfully.";
          } else {
            this.msg = "Update failed.";
          }
        }).catch(error => {
          this.msg = "Update failed.";
          console.error("updated error", error.message);
        })
    }, () => { })
  }

}
