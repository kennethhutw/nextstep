import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RecruitService,
  DataService,
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
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.scss"]
})
export class JobComponent implements OnInit {
  items = [{
    name: "Kenneth",
    position: "Software developer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar2.png",
    isFavortie: false,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "full-stack",
      "blockchain"
    ]

  },
  {
    name: "Anne",
    position: "UI/UX designer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar3.png",
    isFavortie: true,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "UI/UX",
      "Front-end"
    ]
  },
  {
    name: "Ken",
    position: "DevOps developer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar4.png",
    isFavortie: false,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "DevOps ",
      "IT"
    ]
  }];
  currentUser = null;
  currentRecruit;
  selectedItem;
  isChat: boolean = false;
  projectOwner;
  constructor(
    private settingSrv: SettingService,
    private recruitSrv: RecruitService,
    private utility: Utility,
    private authStore: AuthStore,
    private route: ActivatedRoute,
    private viewsService: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
    public toastr: ToastService
  ) {

  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authStore.getUserData();

    let _userId = null;
    if (this.currentUser && this.currentUser.id) {
      _userId = this.currentUser.id;
    }
    let id = this.route.snapshot.paramMap.get("id");
    this.recruitSrv.getById(id, _userId).then(res => {
      if (res['result'] == 'successful') {
        this.currentRecruit = res['data'];

      }
      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })
  }

  onSave() { }

  onSelectItem(item) {
    this.selectedItem = item;
  }

  onSubmit() {

  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }


  onClickFollow() {

    if (this.currentRecruit.isFollowing) {
      this.viewsService.unFollow(
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
      this.viewsService.follow(
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
      this.viewsService.unCollect(
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
      this.viewsService.collect(
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

  onChat() {

    this.isChat = !this.isChat;
  }

  onToggleChat(event) {
    this.isChat = !this.isChat;
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
