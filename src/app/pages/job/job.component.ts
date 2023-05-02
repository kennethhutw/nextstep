import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RecruitService,
  NotificationService,
  AppSettingsService,
  MembersService,
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
  application_message: string = `很高興看到你們正在開發一個非常有趣的 side project，並且正在尋找一名前端工程師。我認為我有能力和動機加入你們的團隊並貢獻我的技能和熱情。

      我對你們的項目充滿熱情，並且非常想為之做出貢獻。我相信我可以和你們的團隊一起協作，並且學習和成長。如果你們覺得我是你們需要的人選，請不要猶豫聯繫我。謝謝你們的時間和考慮！

[你的名字]`;
  constructor(
    private settingSrv: SettingService,
    private recruitSrv: RecruitService,
    private utility: Utility,
    private authStore: AuthStore,
    private route: ActivatedRoute,
    private viewsSrv: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    private notificationSrv: NotificationService,
    private membersSrv: MembersService,
    public toastr: ToastService
  ) {
    this.skillOptions = this.appSettingsSrv.skillOptions();
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
          if (!this.utility.IsNullOrEmpty(this.currentRecruit.skills)) {
            this.currentRecruit.skills = this.currentRecruit.skills.split(',');
          }
          if (!this.utility.IsNullOrEmpty(this.currentRecruit.projectImageUrl)) {
            this.currentRecruit.projectImageUrl = environment.assetUrl + this.currentRecruit.projectImageUrl;
          }
          console.log("currentRecruit ====", this.currentRecruit)

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
        this.toastr.showToast('Success', "申請成功送出", this.toastr.iconClasses.success);
        this.selectedApplication = null;

        this.notificationSrv.infoProjectMembers(application.projectId,
          this.currentUser.id,
          `${this.currentUser.name}  想要應徵 ${application.projectName} - ${application.position} ！` + this.application_message,
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
        this.toastr.showToast('Failed', "申請送出失敗", this.toastr.iconClasses.error);
      }
    }).catch(error => {
      this.toastr.showToast('Failed', "申請送出失敗", this.toastr.iconClasses.error);
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
          this.toastr.showToast('Success', "取消追蹤成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "取消追蹤失敗", this.toastr.iconClasses.error);
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
          this.toastr.showToast('Success', "追蹤成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "追蹤失敗", this.toastr.iconClasses.error);
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
          this.toastr.showToast('Success', "取消收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "取消收藏失敗", this.toastr.iconClasses.error);
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
          this.toastr.showToast('Success', "收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "收藏失敗", this.toastr.iconClasses.error);
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

          let _index = this.currentRecruit.others.findIndex((obj => obj.id == recruitId));
          this.currentRecruit.others[_index].isCollected = true;
          this.toastr.showToast('Success', "收藏成功 ", this.toastr.iconClasses.success);
        } else {
          this.toastr.showToast('Failed', "收藏失敗", this.toastr.iconClasses.error);
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
