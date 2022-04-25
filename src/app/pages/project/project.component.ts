import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  MembersService,
  ProjectService,
  LikeService,
  DataService,
  AppSettingsService,
  SettingService,
  ToastService
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
  styleUrls: ["./project.component.css"]
})
export class ProjectComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  defaultProfileLogo = null;

  currentUser;
  currentProject = null;
  projectId;
  application_message: string = "";
  selectedApplication: any;
  constructor(
    private ProjectSrv: ProjectService,
    private authStore: AuthStore,
    private likeSrv: LikeService,
    private settingSrv: SettingService,
    private membersSrv: MembersService,
    private utility: Utility,
    private route: ActivatedRoute,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    public toastr: ToastService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();
    let _id = null;
    if (this.currentUser && this.currentUser.id) {
      _id = this.currentUser.id;
    }
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.ProjectSrv.getProject(this.projectId, _id).then(res => {
      if (res['result'] == 'successful') {
        this.currentProject = res['data'];
      }
      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })


  }



  onfilter(value) {


  }
  onApply(application) {
    this.selectedApplication = application;
  }
  onSubmit(application) {
    const params = {
      projectId: this.currentProject.id,
      userId: this.currentUser.id,
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
    this.membersSrv.insertMember(
      params
    ).then(res => {
      if (res["result"] == "successful") {
        this.toastr.showToast('Success', "Submitted successfully", this.toastr.iconClasses.success);
      } else {
        this.toastr.showToast('Failed', "Submitted failed", this.toastr.iconClasses.error);
      }
    }).catch(error => {
      this.toastr.showToast('Failed', "Submitted failed", this.toastr.iconClasses.error);
    })
    this.closebutton.nativeElement.click();
  }

  onSave() { }

}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
