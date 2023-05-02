import {
  Component, OnInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  MembersService,
  ProjectService,
  PagerService,
  AppSettingsService,
  SettingService,
  ToastService,
  ViewsService,
  DialogService,
  RecruitService,
  NotificationService
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
import * as moment from 'moment';

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  @ViewChild('close_recruit_button') close_recruit_button: ElementRef;

  projectForm: FormGroup;
  projectMsg: string = "";

  defaultProfileLogo = null;

  currentUser;
  currentProject = null;
  projectId;
  application_message: string = `很高興看到你們正在開發一個非常有趣的 side project，並且正在尋找一名前端工程師。我認為我有能力和動機加入你們的團隊並貢獻我的技能和熱情。

      我對你們的項目充滿熱情，並且非常想為之做出貢獻。我相信我可以和你們的團隊一起協作，並且學習和成長。如果你們覺得我是你們需要的人選，請不要猶豫聯繫我。謝謝你們的時間和考慮！

      [你的名字]`;
  selectedApplication: any;
  currentPageIndex = 1;

  isChat: boolean = false;
  projectOwner = null;

  skillOptions: any[] = [];
  currentTab: string = "history";
  submitted = false;

  recruitForm: FormGroup;
  constructor(
    private router: Router,
    private projectSrv: ProjectService,
    private pagerSrv: PagerService,
    private authStore: AuthStore,
    private formBuilder: FormBuilder,
    private settingSrv: SettingService,
    private membersSrv: MembersService,
    public utilitySrv: Utility,
    private route: ActivatedRoute,
    private recruitSrv: RecruitService,
    private viewsSrv: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    public toastSrv: ToastService,
    private dialogSrv: DialogService,
    private notificationSrv: NotificationService
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
          if (this.currentProject.members) {
            this.currentProject.members.forEach(element => {
              if (!this.utilitySrv.IsNullOrEmpty(element.imageUrl)) {
                element.imageUrl = environment.assetUrl + element.imageUrl;
              }
            });
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

          if (this.currentProject.recruit) {
            this.currentProject.recruit.forEach(element => {
              if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
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

          if (this.utilitySrv.IsNullOrEmpty(this.currentProject.imageUrl)) {
            this.currentProject.imageUrl = this.defaultProfileLogo;
          } else {
            this.currentProject.imageUrl = environment.assetUrl + this.currentProject.imageUrl;
          }
          if (!this.utilitySrv.IsNullOrEmpty(this.currentProject.coverUrl)) {

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

    this.recruitForm = this.formBuilder.group({
      id: [""],
      position: ["", Validators.required],
      scopes: ["", Validators.required],
      skills: [""],
      work12: [false],
      work34: [false],
      work56: [false],
      work78: [false],
      work9: [false],
    });
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
      status: "candidate",
      available: "0",
      recruitId: application.id,
      uid: this.currentUser.id,
    }
    this.membersSrv.apply(
      params
    ).then(res => {
      if (res["result"] == "successful") {
        this.toastSrv.showToast('Success', "申請成功送出", this.toastSrv.iconClasses.success);

        this.selectedApplication = null;

        this.notificationSrv.infoProjectMembers(this.currentProject.id,
          this.currentUser.id,
          `${this.currentUser.name}  想要應徵 ${this.currentProject.name} - ${application.position} ！` + this.application_message,
          "1",
          '0',
          '0',
          this.currentUser.id
        ).then(res => {
          if (res['result'] === 'successful') {
            this.application_message = `很高興看到你們正在開發一個非常有趣的 side project，並且正在尋找一名前端工程師。我認為我有能力和動機加入你們的團隊並貢獻我的技能和熱情。

      我對你們的項目充滿熱情，並且非常想為之做出貢獻。我相信我可以和你們的團隊一起協作，並且學習和成長。如果你們覺得我是你們需要的人選，請不要猶豫聯繫我。謝謝你們的時間和考慮！

[你的名字]`;
          }
        })
      } else {
        this.toastSrv.showToast('Failed', "申請送出失敗", this.toastSrv.iconClasses.error);
      }
    }).catch(error => {
      this.toastSrv.showToast('Failed', "申請送出失敗", this.toastSrv.iconClasses.error);
    })
    this.closebutton.nativeElement.click();
  }

  IsNullorEmpty(value) {
    return !this.utilitySrv.IsNullOrEmpty(value)
  }
  onImgError(event) {
    event.target.src = "assets/images/defaultProjectIcon.png";
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
          this.toastSrv.showToast('Success', "取消追蹤成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "取消追蹤失敗", this.toastSrv.iconClasses.error);
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
          this.toastSrv.showToast('Success', "追蹤成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "追蹤失敗", this.toastSrv.iconClasses.error);
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
          this.toastSrv.showToast('Success', "取消收藏成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "取消收藏失敗", this.toastSrv.iconClasses.error);
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
          this.toastSrv.showToast('Success', "收藏成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "收藏失敗", this.toastSrv.iconClasses.error);
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

  onDeleteJobItem(item) {
    this.dialogSrv.deleteThis('確定刪除此' + item.position, `確定刪除此${item.position}?,此動作將無法復原`, () => {
      this.recruitSrv.delete(item.id, this.currentUser.id).then(res => {
        if (res['result'] == "successful") {

          this.currentProject.recruit = this.currentProject.recruit.filter(obj => {
            return obj.id !== item.id
          })

          this.toastSrv.showToast('Success',
            " " + item.name + "已刪除.",
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            res['message'],
            this.toastSrv.iconClasses.error);
        }
      }).catch(error => {
        console.error("Delete failed! " + error.message);
        this.toastSrv.showToast('Failed',
          error.message,
          this.toastSrv.iconClasses.error);
      })
    }, () => { })

  }
  onModifyJobItem(item) {
    this.selectedApplication = item;
    let _skills = [];
    if (!this.utilitySrv.IsNullOrEmpty(item.skills)) {


      this.skillOptions.map(option => {
        if (item.skills.includes(option.value)) {
          _skills.push(option.text);
        }
      })
    }
    this.recruitForm.setValue({
      id: item.id,
      position: item.position,
      scopes: item.scopes,
      skills: _skills,
      work12: item.work12,
      work34: item.work34,
      work56: item.work56,
      work78: item.work78,
      work9: item.work9,
    });
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

          this.toastSrv.showToast('Success', "取消收藏成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "取消收藏失敗", this.toastSrv.iconClasses.error);
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
          this.toastSrv.showToast('Success', "收藏成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "收藏失敗", this.toastSrv.iconClasses.error);
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
        //this.currentProject.coverUrl = "assets/images/defaultCover.png";
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
    const values = this.projectForm.value;
    this.projectSrv.update(this.currentProject.id, {
      name: values.name,
      description: values.description,
      product: values.product,
      type: values.type,
      stage: values.stages,
      isFindPartner: values.isFindPartner,
      isFunding: values.isFunding,
      isCofounder: values.isCofounder,
      uid: this.currentUser.id
    }).subscribe(res => {
      if (res['result'] === 'successful') {
        this.projectMsg = "Update successfully.";
        this.currentProject.name = values.name;
        this.currentProject.description = values.description;
        this.currentProject.product = values.product;
        this.currentProject.type = values.type;
        this.currentProject.stage = values.stages;
        this.currentProject.isFindPartner = values.isFindPartner;
        this.currentProject.isFunding = values.isFunding;
        this.currentProject.isCofounder = values.isCofounder;
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

  onUpdateRecruitSubmit() {
    this.submitted = true;
    if (this.recruitForm.invalid) {
      return;
    }
    const values = this.recruitForm.value;
    let _skills = "";
    let _skills_array = [];

    if (values.skills) {
      values.skills.map(skill => {
        let _skill_text = skill;
        if (typeof skill == "object") {
          _skill_text = skill.text;
        }
        let _index = this.skillOptions.findIndex((obj => obj.text == _skill_text));
        if (_index > -1) {
          _skills += this.skillOptions[_index].value + ",";
          _skills_array.push(this.skillOptions[_index].value);
        }
      })

      if (_skills.length > 0) {
        _skills = _skills.substring(0, _skills.length - 1);
      }
    }
    let params = {
      position: values.position,
      scopes: values.scopes,
      projectId: this.projectId,
      skills: _skills,
      work12: values.work12 ? values.work12 : "0",
      work34: values.work34 ? values.work34 : "0",
      work56: values.work56 ? values.work56 : "0",
      work78: values.work78 ? values.work78 : "0",
      work9: values.work9 ? values.work9 : "0",
      uid: this.currentUser.id
    }

    this.recruitSrv.update(values.id, params).then(res => {

      if (res["result"] === "successful") {
        this.recruitForm.reset();
        this.close_recruit_button.nativeElement.click();

        this.currentProject.recruit.forEach(element => {
          if (element.id === values.id) {
            element.position = values.position,
              element.scopes = values.scopes,
              element.work12 = values.work12,
              element.work34 = values.work34,
              element.work56 = values.work56,
              element.work78 = values.work78,
              element.work9 = values.work9;
            element.skills = _skills_array;

          }
        });
        this.close_recruit_button.nativeElement.click();
        this.toastSrv.showToast('Success',
          " " + values.position + "已更新.",
          this.toastSrv.iconClasses.success);
      } else {

      }
    }).catch(error => {
      this.toastSrv.showToast('Failed',
        error.message,
        this.toastSrv.iconClasses.error);
    })
  }

}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
