import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  MembersService,
  ProjectService,
  LikeService,
  PagerService,
  AppSettingsService,
  SettingService,
  ToastService,
  ViewsService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  defaultProfileLogo = null;

  currentUser;
  currentProject = null;
  projectId;
  application_message: string = "";
  selectedApplication: any;
  currentPageIndex = 1;

  isChat: boolean = false;
  projectOwner = null;

  constructor(
    private ProjectSrv: ProjectService,
    private pagerSrv: PagerService,
    private authStore: AuthStore,
    private likeSrv: LikeService,
    private settingSrv: SettingService,
    private membersSrv: MembersService,
    private utility: Utility,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    public toastr: ToastService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;

  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();

    this.projectId = this.route.snapshot.paramMap.get("id");
    let _id = null;
    if (this.currentUser && this.currentUser.id) {
      _id = this.currentUser.id;
    }
    this.ProjectSrv.getProject(this.projectId, _id).then(res => {
      console.log("getProject ======", res);
      if (res['result'] == 'successful') {
        this.currentProject = res['data'];
        if (this.currentProject) {
          let _owners = this.currentProject.members.filter(member => {
            return member.userId === this.currentProject.owner
          })

          if (_owners.length > 0) {
            this.projectOwner = _owners[0];
            this.projectOwner.name = this.projectOwner.userName;
            this.projectOwner.projectId = this.projectOwner.id;
            this.projectOwner.id = this.projectOwner.userId;
          }
        }
      }
      let _id = null;
      if (this.currentUser && this.currentUser.id) {
        _id = this.currentUser.id;
        if (this.currentUser.owner != this.currentUser.id) {
          this.viewsService.insert(
            this.projectId,
            "project",
            _id,
            "",
            _id
          );
        }

      } else {
        this.viewsService.insert(
          this.projectId,
          "project",
          _id,
          "",
          _id
        );

      }

      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })
  }




  onApply(application) {
    this.selectedApplication = application;
  }

  onSubmit(application) {
    const params = {
      projectId: this.currentProject.id,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      startDate: "",
      endDate: "",
      role: "candidate",
      position: application.position,
      scopes: application.scopes,
      isAdmin: "0",
      isOwner: "0",
      status: "new",
      available: "0",
      recruitId: application.id,
      uid: this.currentUser.id,
    }
    this.membersSrv.apply(
      params
    ).then(res => {
      if (res["result"] == "successful") {
        this.toastr.showToast('Success', "Submitted successfully", this.toastr.iconClasses.success);
        this.application_message = "";
        this.selectedApplication = null;
      } else {
        this.toastr.showToast('Failed', "Submitted failed", this.toastr.iconClasses.error);
      }
    }).catch(error => {
      this.toastr.showToast('Failed', "Submitted failed", this.toastr.iconClasses.error);
    })
    this.closebutton.nativeElement.click();
  }

  onSave() { }
  IsNullorEmpty(value) {
    return !this.utility.IsNullOrEmpty(value)
  }
  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  // Pagination
  onPage(i, currentPageIndex) {
    let _num = this.pagerSrv.Page(i, currentPageIndex, 3);
    return _num;
  }

  onClickFollow() {
    this.viewsService.follow(
      this.projectId,
      "project",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        this.currentProject.followCount += 1;
        this.toastr.showToast('Success', "追蹤成功 ", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "追蹤失敗", this.toastr.iconClasses.error);
      }
    });


  }

  onClickCollect() {
    this.viewsService.collect(
      this.projectId,
      "project",
      this.currentUser.id
    ).then(res => {
      if (res['result'] == 'successful') {
        this.currentProject.collectCount += 1;
        this.toastr.showToast('Success', "收藏成功 ", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "收藏失敗", this.toastr.iconClasses.error);
      }
    });

  }

  onChat() {

    this.isChat = !this.isChat;
  }

  onToggleChat(event) {
    this.isChat = !this.isChat;
  }

  onSelectItem(item) {
    this.selectedApplication = item;
  }

}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
