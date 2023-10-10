import {
  Component, OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
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
  NotificationService,
  WorkService,
  DataService
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

import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from '@angular/platform-browser';
@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {

  @ViewChild('closebutton') closebutton;
  @ViewChild('close_recruit_button') close_recruit_button: ElementRef;

  projectForm: FormGroup;
  workForm: FormGroup;
  recruitForm: FormGroup;
  projectMsg: string = "";

  defaultProfileLogo = null;

  currentUser;
  currentProject = null;
  projectId;
  defual_application_message: string = ``;

  application_message: string;

  msg = {
    startfollow: "",
    stopfollow: "",
    collectla: "",
    uncollectla: "",
    wantapply: "",
    confirmdel: "",
    deleted: "",
    updateSuc: "",
    updateFailed: "",
    worktitle: "",
    uncovered: "",
    collect: "",
    collected: "",
    following: "",
    followed: "",
    notfilled: ""
  }
  selectedApplication: any;
  selectedWork: any;
  currentPageIndex = 1;

  isChat: boolean = false;
  projectOwner = null;

  skillOptions: any[] = [];
  currentTab: string = "history";
  submitted = false;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
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
    private notificationSrv: NotificationService,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private WorkSrv: WorkService,
    private sanitizer: DomSanitizer
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProjectLogo;
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

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.toastSrv.changeLang(this.translateSrv);
      this.init_terms();

    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.toastSrv.changeLang(this.translateSrv);
        this.init_terms();
      }
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
          // this.currentProject.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.currentProject.imageUrl);

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

    this.workForm = this.formBuilder.group({
      id: [""],
      text: ["", Validators.required],
      link: ["", Validators.required],
      isPublic: [false, Validators.required]
    });
  }

  init_terms() {
    this.translateSrv.get("STARTFOLLOW").subscribe((text: string) => {
      this.msg.startfollow = text;
    });

    this.translateSrv.get("STOPFOLLOW").subscribe((text: string) => {
      this.msg.stopfollow = text;
    });

    this.translateSrv.get("COLLECTLA").subscribe((text: string) => {
      this.msg.collectla = text;
    });

    this.translateSrv.get("UNCOLLECT").subscribe((text: string) => {
      this.msg.uncollectla = text;
    });

    this.translateSrv.get("APPMSG").subscribe((text: string) => {
      this.defual_application_message = text;
      this.application_message = this.defual_application_message;
    });

    this.translateSrv.get("WANTAPPLY").subscribe((text: string) => {
      this.msg.wantapply = text;
    });

    this.translateSrv.get("CONFIRMDELETE").subscribe((text: string) => {
      this.msg.confirmdel = text;
    });

    this.translateSrv.get("DELETED").subscribe((text: string) => {
      this.msg.deleted = text;
    });

    this.translateSrv.get("UPDATEDSUC").subscribe((text: string) => {
      this.msg.updateSuc = text;
    });

    this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
      this.msg.updateFailed = text;
    });

    this.translateSrv.get("WORK").subscribe((text: string) => {
      this.msg.worktitle = text;
    });

    this.translateSrv.get("ACTIONUNCOVER").subscribe((text: string) => {
      this.msg.uncovered = text;
    });

    this.translateSrv.get("FOLLOW").subscribe((text: string) => {
      this.msg.following = text;
    });

    this.translateSrv.get("FOLLOWED").subscribe((text: string) => {
      this.msg.followed = text;
    });

    this.translateSrv.get("COLLECT").subscribe((text: string) => {
      this.msg.collect = text;
    });

    this.translateSrv.get("COLLECTED").subscribe((text: string) => {
      this.msg.collected = text;
    });

    this.translateSrv.get("NOTFILLED").subscribe((text: string) => {
      this.msg.notfilled = text;
    });
  }

  getFollow(project) {
    let _lang = localStorage.getItem("lang");

    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      let collectCount = project.collectCount ? project.collectCount : '0';
      let followCount = project.followCount ? project.followCount : '0';
      if (_lang.indexOf("en") > -1) {
        return collectCount + " collected  /" + followCount + " following  ";
      } else if (_lang.indexOf("tw") > -1) {
        return collectCount + " 人收藏 / " + followCount + " 人追蹤 ";
      } else if (_lang.indexOf("tw") > -1) {
        return collectCount + " 人收藏 / " + followCount + " 人追踪 ";
      }

    }

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
        this.toastSrv.showToast('Success',
          this.toastSrv.applysendsuc,
          this.toastSrv.iconClasses.success);

        this.selectedApplication = null;

        this.notificationSrv.infoProjectMembers(this.currentProject.id,
          this.currentUser.id,
          `${this.currentUser.name}   ${this.msg.wantapply} ${this.currentProject.name} - ${application.position} ！` + this.application_message,
          "1",
          '0',
          '0',
          this.currentUser.id
        ).then(res => {
          if (res['result'] === 'successful') {
            this.application_message = this.defual_application_message;
          }
        })
      } else {
        this.toastSrv.showToast('Failed',
          this.toastSrv.applysendfailed,
          this.toastSrv.iconClasses.error);
      }
    }).catch(error => {
      this.toastSrv.showToast('Failed',
        this.toastSrv.applysendfailed,
        this.toastSrv.iconClasses.error);
    })
    this.closebutton.nativeElement.click();
  }

  IsNullorEmpty(value) {
    return !this.utilitySrv.IsNullOrEmpty(value)
  }
  onImgError(event) {
    event.target.src = this.settingSrv.defaultProjectLogo;
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
          this.toastSrv.showToast('Success',
            this.toastSrv.unfollowingStr + this.toastSrv.successfulStr,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            this.toastSrv.unfollowingStr + this.toastSrv.failedStr,
            this.toastSrv.iconClasses.success);
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
          this.currentProject.followCount -= 1;
          this.currentProject.isFollowing = false;
          this.toastSrv.showToast('Success',
            this.toastSrv.followingStr + this.toastSrv.successfulStr,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            this.toastSrv.followingStr + this.toastSrv.failedStr,
            this.toastSrv.iconClasses.success);
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
          this.toastSrv.showToast('Success',
            this.toastSrv.uncollectStr + this.toastSrv.successfulStr,
            this.toastSrv.iconClasses.error);
        } else {
          this.toastSrv.showToast('Failed',
            this.toastSrv.uncollectStr + this.toastSrv.failedStr,
            this.toastSrv.iconClasses.error);
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
          this.toastSrv.showToast('Success',
            this.toastSrv.collectStr + this.toastSrv.successfulStr,
            this.toastSrv.iconClasses.error);
        } else {
          this.toastSrv.showToast('Failed',
            this.toastSrv.collectStr + this.toastSrv.failedStr,
            this.toastSrv.iconClasses.error);
        }
      });
    }

  }


  onClickJobCollect(event) {
    console.log(event);
    if (event.isCollected) {
      this.viewsSrv.unCollect(
        event.recruitId,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          let _index = this.currentProject.recruit.findIndex((obj => obj.id == event.recruitId));
          this.currentProject.recruit[_index].isCollected = false;

          this.toastSrv.showToast('Success',
            this.toastSrv.uncollectStr + this.toastSrv.successfulStr,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            this.toastSrv.uncollectStr + this.toastSrv.failedStr,
            this.toastSrv.iconClasses.error);
        }
      });
    } else {
      this.viewsSrv.collect(
        event.recruitId,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {

          let _index = this.currentProject.recruit.findIndex((obj => obj.id == event.recruitId));
          this.currentProject.recruit[_index].isCollected = true;
          this.toastSrv.showToast('Success',
            this.toastSrv.collectStr + this.toastSrv.successfulStr,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            this.toastSrv.collectStr + this.toastSrv.failedStr,
            this.toastSrv.iconClasses.error);
        }
      });
    }

  }

  onCoverImgError(event) {
    //event.target.src = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
    event.target.src = this.settingSrv.defaultProjectCover;
  }

  onToggleChat(event) {
    this.isChat = !this.isChat;
  }

  // Job start

  onSelectItem(event) {
    console.log("event", event)
    this.selectedApplication = event;
  }

  onDeleteJobItem(item) {
    this.dialogSrv.deleteThis(this.msg.confirmdel + item.position,
      `${this.msg.deleted} ${item.position}?, ${this.msg.uncovered}`, () => {
        this.recruitSrv.delete(item.id, this.currentUser.id).then(res => {
          if (res['result'] == "successful") {

            this.currentProject.recruit = this.currentProject.recruit.filter(obj => {
              return obj.id !== item.id
            })

            this.toastSrv.showToast('Success',
              " " + item.name + this.msg.deleted,
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

      // this.currentProject.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.currentProject.imageUrl);

      this.changeDetectorRef.detectChanges();
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
          " " + values.position + " " + this.msg.updateSuc,
          this.toastSrv.iconClasses.success);
      } else {

      }
    }).catch(error => {
      this.toastSrv.showToast('Failed',
        error.message,
        this.toastSrv.iconClasses.error);
    })
  }

  onClickWork(work) {
    this.selectedWork = work;
    this.workForm.setValue({
      id: this.selectedWork.id,
      text: this.selectedWork.text,
      link: this.selectedWork.link,
      isPublic: this.selectedWork.isPublic
    });
  }
  onCancelEditWork() {
    this.selectedWork = null;
    this.workForm.reset();
  }

  get g() {
    return this.workForm.controls;
  }

  inWorkValid() {
    return this.workForm.invalid;
  }

  onAddWork() {
    this.submitted = true;

    if (this.workForm.invalid) {
      return;
    }
    const values = this.workForm.value;
    this.WorkSrv.insert(
      this.currentProject.id,
      values.text,
      values.link,
      values.isPublic,
      this.currentUser.id
    ).then(res => {
      if (res['result'] === 'successful') {
        if (!this.currentProject.works) {
          this.currentProject.works = [];
        }

        this.currentProject.works.push({
          id: res['data'],
          text: values.text,
          link: values.link,
          isPublic: values.isPublic,
          uid: this.currentUser.id
        })
        this.submitted = false;
        this.selectedWork = null;
        document.getElementById("close_work").click();
        this.workForm.reset();
        this.toastSrv.showToast(this.msg.worktitle,
          this.msg.updateSuc,
          this.toastSrv.iconClasses.success);
      }
    }, error => {
      this.toastSrv.showToast(this.msg.worktitle,
        this.msg.updateFailed,
        this.toastSrv.iconClasses.error);
      console.error("updated error", error);
    })
  }

  onUpdateWork() {
    this.submitted = true;

    if (this.workForm.invalid) {
      return;
    }
    const values = this.workForm.value;
    this.WorkSrv.update(this.selectedWork.id, {
      projectId: this.currentProject.id,
      text: values.text,
      link: values.link,
      isPublic: values.isPublic,
      uid: this.currentUser.id
    }).then(res => {
      if (res['result'] === 'successful') {
        this.currentProject.works.map(work => {
          if (work.id === this.selectedWork.id) {
            work.text = values.text;
            work.link = values.link;
            work.isPublic = values.isPublic;
          }
        })
        this.submitted = false;
        this.selectedWork = null;
        document.getElementById("close_work").click();
        this.workForm.reset();
        this.toastSrv.showToast(this.msg.worktitle,
          this.msg.updateSuc,
          this.toastSrv.iconClasses.success);
      }
    }, error => {
      this.toastSrv.showToast(this.msg.worktitle, this.msg.updateFailed,
        this.toastSrv.iconClasses.error);
      console.error("updated error", error);
    })
  }

  onDeleteWork(work) {
    this.dialogSrv.deleteThis(this.msg.deleted + work.text,
      `${this.msg.deleted} ${work.text}?, ${this.msg.uncovered}`, () => {

        this.WorkSrv.delete(
          work.id,
        ).then(res => {
          if (res['result'] == 'successful') {
            this.currentProject.works = this.currentProject.works.filter(element => {
              return element.id !== work.id
            });

            this.toastSrv.showToast('Success',
              " " + work.text + this.msg.deleted,
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

  onWorkChange($event) {
    this.workForm.get('isPublic').setValue($event.target.checked);
  }

  isShowWork(work) {
    if (!this.currentUser) {
      return work.isPublic;
    }
    else if (this.currentProject.owner == this.currentUser.id) {
      return true;

    } else {
      return work.isPublic;
    }
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
