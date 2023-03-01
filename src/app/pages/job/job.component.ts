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
  items = [];
  currentUser = null;
  currentRecruit;
  selectedItem;
  isChat: boolean = false;
  projectOwner;
  skillOptions: any[] = [];
  constructor(
    private settingSrv: SettingService,
    private recruitSrv: RecruitService,
    private utility: Utility,
    private authStore: AuthStore,
    private route: ActivatedRoute,
    private viewsSrv: ViewsService,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService,
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
    //  let _recruitId = this.route.snapshot.paramMap.get("id");



  }


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

  onChat() {

    this.isChat = !this.isChat;
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
