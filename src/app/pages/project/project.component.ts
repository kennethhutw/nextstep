import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  MembersService,
  ProjectService,
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
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  projectForm: FormGroup;
  projectMsg: string = "";

  defaultProfileLogo = null;

  currentUser;
  currentProject = null;
  projectId;
  application_message: string = "";
  selectedApplication: any;
  currentPageIndex = 1;

  isChat: boolean = false;
  projectOwner = null;

  skillOptions: any[] = [];
  currentTab: string = "history";
  submitted = false;
  constructor(
    private router: Router,
    private projectSrv: ProjectService,
    private pagerSrv: PagerService,
    private authStore: AuthStore,
    private formBuilder: FormBuilder,
    private settingSrv: SettingService,
    private membersSrv: MembersService,
    public utility: Utility,
    private route: ActivatedRoute,
    private viewsSrv: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    public toastr: ToastService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;
    this.skillOptions = this.appSettingsSrv.skillOptions();
    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      isFindPartner: [0, Validators.required],
      isFunding: [0, Validators.required],
      isCofounder: [0, Validators.required],
      product: ["", Validators.required],
      type: ["", Validators.required],
      stages: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();

    this.projectId = this.route.snapshot.paramMap.get("id");
    let _id = null;
    if (this.currentUser && this.currentUser.id) {
      _id = this.currentUser.id;
    }
    this.projectSrv.getProject(this.projectId, _id).then(res => {
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

          if (this.currentProject.recruit) {
            this.currentProject.recruit.forEach(element => {
              if (!this.utility.IsNullOrEmpty(element.skills)) {
                element.skills = element.skills.split(',');
              }
            });
          }

          this.projectForm.setValue({
            name: this.currentProject.name,
            description: this.currentProject.description,
            isFindPartner: this.currentProject.isFindPartner,
            isFunding: this.currentProject.isFunding,
            isCofounder: this.currentProject.isCofounder,
            product: this.currentProject.product,
            type: this.currentProject.type,
            stages: this.currentProject.stage
          });

          if (this.utility.IsNullOrEmpty(this.currentProject.imageUrl)) {
            this.currentProject.imageUrl = this.defaultProfileLogo;
          } else {
            this.currentProject.imageUrl = environment.assetUrl + this.currentProject.imageUrl;
          }
          if (!this.utility.IsNullOrEmpty(this.currentProject.coverUrl)) {

            this.currentProject.coverUrl = environment.assetUrl + this.currentProject.coverUrl;
          }
        }

      }
      let _id = null;
      if (this.currentUser && this.currentUser.id) {
        _id = this.currentUser.id;
      }
      this.viewsSrv.insert(
        this.projectId,
        "project",
        _id,
        "",
        _id
      ).then(res => {

      }).catch(error => {
        console.error("Add view record failed", error)
      });;

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
    if (this.currentProject.isFollowing) {
      this.viewsSrv.unFollow(
        this.projectId,
        "project",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentProject.followCount -= 1;
          this.currentProject.isFollowing = false;
          this.toastr.showToast('Success', "取消追蹤成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "取消追蹤失敗", this.toastr.iconClasses.error);
        }
      });
    }
    else {
      this.viewsSrv.follow(
        this.projectId,
        "project",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentProject.followCount += 1;
          this.currentProject.isFollowing = true;
          this.toastr.showToast('Success', "追蹤成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "追蹤失敗", this.toastr.iconClasses.error);
        }
      });
    }

  }

  onClickCollect() {
    if (this.currentProject.isCollected) {
      this.viewsSrv.unCollect(
        this.projectId,
        "project",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentProject.collectCount -= 1;
          this.currentProject.isCollected = false;
          this.toastr.showToast('Success', "取消收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "取消收藏失敗", this.toastr.iconClasses.error);
        }
      });
    } else {
      this.viewsSrv.collect(
        this.projectId,
        "project",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentProject.collectCount += 1;
          this.currentProject.isCollected = true;
          this.toastr.showToast('Success', "收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "收藏失敗", this.toastr.iconClasses.error);
        }
      });
    }

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


  changeTab(tab) {
    this.currentTab = tab;
  }

  convertTag(term) {
    let _term = this.skillOptions.find(option => option.value == term.toLowerCase());
    if (_term) {
      return _term.text;
    }
  }


  onClickJobCollect(recruitId, isCollected) {
    if (isCollected) {
      this.viewsSrv.unCollect(
        recruitId,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          let _index = this.currentProject.recruit.findIndex((obj => obj.id == recruitId));
          this.currentProject.recruit[_index].isCollected = false;

          this.toastr.showToast('Success', "取消收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "取消收藏失敗", this.toastr.iconClasses.error);
        }
      });
    } else {
      this.viewsSrv.collect(
        recruitId,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {

          let _index = this.currentProject.recruit.findIndex((obj => obj.id == recruitId));
          this.currentProject.recruit[_index].isCollected = true;
          this.toastr.showToast('Success', "收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "收藏失敗", this.toastr.iconClasses.error);
        }
      });
    }

  }

  onUploadProfileImage(event) {

    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let formData = new FormData();
    formData.append("id", this.currentProject.id);
    formData.append("uid", this.currentUser.id);
    formData.append("file", event.target.files[0]);

    this.projectSrv.updateImage(this.currentProject.id, formData).subscribe(res => {
      if (res['result'] == 'successful') {
        this.currentProject.imageUrl = environment.assetUrl + res["data"];
      } else {
        this.currentProject.imageUrl = this.defaultProfileLogo;
      }
    })
  }

  onUploadProfileCover(event) {

    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let formData = new FormData();
    formData.append("id", this.currentProject.id);
    formData.append("uid", this.currentUser.id);
    formData.append("file", event.target.files[0]);
    this.projectSrv.updateCover(this.currentProject.id, formData).subscribe(res => {
      if (res['result'] == 'successful') {
        this.currentProject.coverUrl = environment.assetUrl + res["data"];
      } else {
        this.currentProject.coverUrl = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
      }
    })
  }

  onCoverImgError(event) {
    event.target.src = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
  }

  get f() {
    return this.projectForm.controls;
  }
  inValid() {
    return this.projectForm.invalid;
  }

  onStatusChange($event, property) {
    this.projectForm.get(property).setValue($event.target.checked);
  }

  onStageChange($event, value) {
    var _values = this.projectForm.get('stages').value;

    if ($event.target.checked) {
      if (_values.indexOf(',') > 0) {
        _values += "," + value;
      } else {
        _values += value;
      }
    } else {
      _values = _values.replace("," + value, "");
      _values = _values.replace(value, "");
    }
    this.projectForm.get('stages').setValue(_values);
  }

  onProductChange($event, value) {

    var _values = this.projectForm.get('product').value;

    if ($event.target.checked) {
      _values += "," + value;
    } else {
      _values = _values.replace("," + value, "");
    }
    this.projectForm.get('product').setValue(_values);
  }

  onIndustryTypeChange($event, value) {

    var _values = this.projectForm.get('type').value;

    if ($event.target.checked) {
      _values += "," + value;
    } else {
      _values = value.replace("," + value, "");
    }
    this.projectForm.get('type').setValue(_values);
  }

  onModifySubmit() {

    this.submitted = true;
    this.projectMsg = "";
    if (this.projectForm.invalid) {
      return;
    }
    const value = this.projectForm.value;
    this.projectSrv.update(this.currentProject.id, {
      name: value.name,
      description: value.description,
      product: value.product,
      type: value.type,
      stage: value.stages,
      isFindPartner: value.isFindPartner,
      isFunding: value.isFunding,
      isCofounder: value.isCofounder,
      uid: this.currentUser.id
    }).subscribe(res => {
      if (res['result'] === 'successful') {
        this.projectMsg = "Update successfully.";
        this.currentProject.name = value.name;
        this.currentProject.description = value.description;
        this.currentProject.product = value.product;
        this.currentProject.type = value.type;
        this.currentProject.stage = value.stages;
        this.currentProject.isFindPartner = value.isFindPartner;
        this.currentProject.isFunding = value.isFunding;
        this.currentProject.isCofounder = value.isCofounder;
        this.submitted = false;
        document.getElementById("close_modify_project").click();
      }
    }, error => {
      this.projectMsg = "Update failed.";
      console.error("updated error", error);
    })
  }

  onEditMembers() {
    this.router.navigate(['/myproject/' + this.currentProject.id + '/recruit', {}], {});
  }

}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
