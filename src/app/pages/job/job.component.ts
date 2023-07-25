import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RecruitService,
  NotificationService,
  AppSettingsService,
  MembersService,
  SettingService,
  ToastService,
  ViewsService,
  DataService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.scss"]
})
export class JobComponent implements OnInit {
  items = [];
  currentUser = null;
  currentRecruit;

  isChat: boolean = false;
  projectOwner;
  skillOptions: any[] = [];
  @ViewChild('closebutton') closebutton;
  selectedApplication: any;
  defual_application_message: string;
  application_message: string = "";

  msg = {
    jobtitle: "",
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
  constructor(
    private settingSrv: SettingService,
    private recruitSrv: RecruitService,
    private utilitySrv: Utility,
    private authStore: AuthStore,
    private route: ActivatedRoute,
    private viewsSrv: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    private notificationSrv: NotificationService,
    private membersSrv: MembersService,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    public toastSrv: ToastService
  ) {

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.toastSrv.changeLang(this.translateSrv);
      this.init_terms(_lang);
    }

    this.skillOptions = this.appSettingsSrv.skillOptions();
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.toastSrv.changeLang(this.translateSrv);
        this.init_terms(lang);
      }
    });
  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();

    let _userId = null;
    if (this.currentUser && this.currentUser.id) {
      _userId = this.currentUser.id;
    }
    this.route.params.subscribe(params => {

      let _recruitId = params['id'];
      this.recruitSrv.getById(_recruitId, _userId).then(res => {
        if (res['result'] == 'successful') {
          this.currentRecruit = res['data'];
          if (!this.utilitySrv.IsNullOrEmpty(this.currentRecruit.skills)) {
            this.currentRecruit.skills = this.currentRecruit.skills.split(',');
          }
          if (!this.utilitySrv.IsNullOrEmpty(this.currentRecruit.projectImageUrl)) {
            this.currentRecruit.projectImageUrl = environment.assetUrl + this.currentRecruit.projectImageUrl;
          }

          if (!this.utilitySrv.IsNullOrEmpty(this.currentRecruit.projectOthers)) {
            this.currentRecruit.projectOthers.forEach(element => {

              if (!this.utilitySrv.IsNullOrEmpty(element.skills)) {
                element.skills = element.skills.split(',');
              }
            })
          }

        }
        this.SpinnerService.hide();
      }).catch(error => {
        console.error("error", error);
        this.SpinnerService.hide();
      })
      //init view
      let _id = 'not login';
      if (this.currentUser && this.currentUser.id) {
        _id = this.currentUser.id;
      }
      this.viewsSrv.insert(
        _recruitId,
        "recruit",
        _id,
        "",
        _id
      ).then(res => {

      }).catch(error => {
        console.error("Add view record failed", error)
      });
    })

  }


  init_terms(lang) {
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

    this.translateSrv.get("JOBTITLE").subscribe((text: string) => {
      this.msg.jobtitle = text;
    });

    this.skillOptions = this.appSettingsSrv.skillOptionsWithLang(lang);
  }

  getFollow(job) {
    let _lang = localStorage.getItem("lang");

    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      let collectCount = job.collectCount ? job.collectCount : '0';
      let followCount = job.followCount ? job.followCount : '0';
      if (_lang.indexOf("en") > -1) {
        return collectCount + " collected  /" + followCount + " following  ";
      } else if (_lang.indexOf("tw") > -1) {
        return collectCount + " 人收藏 / " + followCount + " 人追蹤 ";
      } else if (_lang.indexOf("tw") > -1) {
        return collectCount + " 人收藏 / " + followCount + " 人追踪 ";
      }

    }

  }

  onSelectItem(item) {
    this.selectedApplication = item;
  }

  onSubmitApplication(application) {
    const params = {
      projectId: application.projectId,
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
        this.toastSrv.showToast('Success',
          this.toastSrv.applysendsuc,
          this.toastSrv.iconClasses.success);
        this.selectedApplication = null;

        this.notificationSrv.infoProjectMembers(application.projectId,
          this.currentUser.id,
          `${this.currentUser.name}  ${this.msg.wantapply} ${application.projectName} - ${application.position} ！` + this.application_message,
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

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }


  onClickFollow() {

    if (this.currentRecruit.isFollowing) {
      this.viewsSrv.unFollow(
        this.currentRecruit.id,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentRecruit.followCount -= 1;
          this.currentRecruit.isFollowing = false;
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
        this.currentRecruit.id,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentRecruit.followCount += 1;
          this.currentRecruit.isFollowing = true;
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
    if (this.currentRecruit.isCollected) {
      this.viewsSrv.unCollect(
        this.currentRecruit.id,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentRecruit.collectCount -= 1;
          this.currentRecruit.isCollected = false;
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
        this.currentRecruit.id,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.currentRecruit.collectCount += 1;
          this.currentRecruit.isCollected = true;
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

  onToggleChat(event) {
    this.isChat = !this.isChat;
  }
  onClickJobCollect(recruitId, isCollected) {
    if (isCollected) {
      this.viewsSrv.unCollect(
        recruitId,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          let _index = this.currentRecruit.others.findIndex((obj => obj.id == recruitId));
          this.currentRecruit.others[_index].isCollected = false;

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
        recruitId,
        "job",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {

          let _index = this.currentRecruit.others.findIndex((obj => obj.id == recruitId));
          this.currentRecruit.others[_index].isCollected = true;
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

  convertTag(term) {

    let _term = this.skillOptions.find(option => option.value == term.toLowerCase());
    if (_term) {
      return _term.text;
    }

  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
