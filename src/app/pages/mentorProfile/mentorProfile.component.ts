import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  NotificationService,
  ViewsService,
  ToastService,
  AppSettingsService,
  SettingService,
  UserService,
  MentorService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { E } from "@angular/core/src/render3";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-mentor-profile",
  templateUrl: "./mentorProfile.component.html",
  styleUrls: ["./mentorProfile.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MentorProfileComponent implements OnInit {

  @ViewChild('closeExpbutton') closeExpbutton;
  @ViewChild('closeInfobutton') closeInfobutton;
  @ViewChild('closefbbutton') closefbbutton;

  items = [];
  displayItems = [];
  values = "";
  tags = [];
  IsShowTags = false;
  defaultProfileLogo = null;
  filterValue = null;
  searchText = '';
  currentUser: any;
  isOwner: Boolean = false;
  userProfile = null;
  skillOptions: any[] = [];


  profileForm: FormGroup;
  experienceForm: FormGroup;
  feedbackForm: FormGroup;
  expModel: string = "new";
  years: string[] = [];
  submitted = false;
  httpreg = '(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  commentModel: string = "new";
  starRating = 0;
  // chat
  isChat: boolean = false;
  reciver;

  // tab
  currentTab: string = "current";

  constructor(
    private viewsSrv: ViewsService,
    public toastSrv: ToastService,
    private notificationSrv: NotificationService,
    private userSrv: UserService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private mentorSrv: MentorService,
    public utilitySrv: Utility,
    private formBuilder: FormBuilder,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService
  ) {
    this.defaultProfileLogo = this.settingSrv.defaultProfileLogo;

    this.skillOptions = this.appSettingsSrv.skillOptions();

    this.profileForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      position: [""],
      company: [""],
      skills: [""],
      website: ["", Validators.pattern(this.httpreg)],
      facebook: ["", Validators.pattern(this.httpreg)],
      twitter: ["", Validators.pattern(this.httpreg)],
      github: ["", Validators.pattern(this.httpreg)],
      linkedin: ["", Validators.pattern(this.httpreg)],
      bio: [""]
    });

    this.experienceForm = this.formBuilder.group({
      id: [""],
      position: ["", Validators.required],
      company: ["", Validators.required],
      isCurrent: [false],
      startYear: [""],
      startMonth: [""],
      endYear: [""],
      endMonth: [""],
      content: [""]
    });

    this.feedbackForm = this.formBuilder.group({
      rating: ["5", Validators.required],
      comment: ["", Validators.required],
    });
    var max = new Date().getFullYear(),
      min = max - 57,
      max = max + 1;

    for (var i = min; i <= max; i++) {
      this.years.push(i.toString());
    }
  }

  ngOnInit() {
    this.SpinnerService.show();
    this.currentUser = this.authSrv.getUserData();

    if (this.currentUser) {
      if (this.utilitySrv.IsNullOrEmpty(this.currentUser.imageUrl)) {
        this.currentUser.imageUrl = this.defaultProfileLogo;
      } else {
        this.currentUser.imageUrl = environment.assetUrl + this.currentUser.imageUrl;
      }
    }
    let userId = this.route.snapshot.paramMap.get('userId');
    let currentUserId = this.currentUser.id ? this.currentUser.id : null;
    this.userSrv.getMentorInfo(userId, currentUserId).then(res => {
      console.log("getMentorInfo ======", res)
      if (res['result'] == 'successful') {
        this.userProfile = res['data'];
        if (!this.utilitySrv.IsNullOrEmpty(this.userProfile.skills)) {

          this.userProfile.skills = this.userProfile.skills.split(",");
        } else {
          this.userProfile.skills = null;
        }
        if (this.utilitySrv.IsNullOrEmpty(this.userProfile.imageUrl)) {
          this.userProfile.imageUrl = this.defaultProfileLogo;
        } else {
          this.userProfile.imageUrl = environment.assetUrl + this.userProfile.imageUrl;
        }
        if (!this.utilitySrv.IsNullOrEmpty(this.userProfile.cover)) {

          this.userProfile.cover = environment.assetUrl + this.userProfile.cover;
        }
        if (!this.utilitySrv.IsNullOrEmpty(this.userProfile.projects)) {
          this.userProfile.projects.forEach(element => {
            element.imageUrl = environment.assetUrl + element.imageUrl;
          });
        }

        if (!this.utilitySrv.IsNullOrEmpty(this.userProfile.comments)) {
          this.userProfile.comments.forEach(element => {
            if (!this.utilitySrv.IsNullOrEmpty(element.imageUrl)) {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            }
          })
        }
        if (this.currentUser && this.currentUser.id) {
          this.isOwner = (this.currentUser.id === this.userProfile.id);
        }
        //init view
        let _id = null;
        if (this.currentUser && this.currentUser.id) {
          _id = this.currentUser.id;
        }
        this.viewsSrv.insert(
          this.userProfile.id,
          "mentor",
          _id,
          "",
          _id
        ).then(res => {

        }).catch(error => {
          console.error("Add view record failed", error)
        });
      }
    })
  }


  onClickFollow(event) {
    if (this.userProfile.isFollowing) {
      this.viewsSrv.unFollow(
        this.userProfile.id,
        "user",
        this.currentUser.id
      ).then(res => {

        if (res['result'] == 'successful') {
          this.userProfile.followCount -= 1;
          this.userProfile.isFollowing = false;
          this.notificationSrv.insert(
            this.userProfile.id,
            this.currentUser.id,
            this.currentUser.name + "停止追蹤你",
            "user",
            0,
            0,
            this.currentUser.id
          ).then(res => { });
          this.toastSrv.showToast('Success', "取消追蹤成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "取消追蹤失敗", this.toastSrv.iconClasses.error);
        }

      });
    } else {
      this.viewsSrv.follow(
        this.userProfile.id,
        "user",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.userProfile.followCount += 1;
          this.userProfile.isFollowing = true;
          this.notificationSrv.insert(
            this.userProfile.id,
            this.currentUser.id,
            this.currentUser.name + "開始追蹤你",
            "user",
            0,
            0,
            this.currentUser.id
          ).then(res => { });
          this.toastSrv.showToast('Success', "追蹤成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "追蹤失敗", this.toastSrv.iconClasses.error);
        }
      });
    }
  }

  onClickCollect(event) {
    if (this.userProfile.isCollected) {
      this.viewsSrv.unCollect(
        this.userProfile.id,
        "user",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.userProfile.collectCount -= 1;
          this.userProfile.isCollected = false;
          this.notificationSrv.insert(
            this.userProfile.id,
            this.currentUser.id,
            this.currentUser.name + "取消收藏你的檔案",
            "user",
            0,
            0,
            this.currentUser.id
          ).then(res => { });
          this.toastSrv.showToast('Success', "取消收藏成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "取消收藏失敗", this.toastSrv.iconClasses.error);
        }
      }).catch(error => {
        console.log("取消收藏", error)
        this.toastSrv.showToast('Failed', "取消收藏失敗", this.toastSrv.iconClasses.error);
      });
    }
    else {
      this.viewsSrv.collect(
        this.userProfile.id,
        "user",
        this.currentUser.id
      ).then(res => {
        if (res['result'] == 'successful') {
          this.userProfile.collectCount += 1;
          this.userProfile.isCollected = true;
          this.notificationSrv.insert(
            this.userProfile.id,
            this.currentUser.id,
            this.currentUser.name + "收藏了你的檔案",
            "user",
            0,
            0,
            this.currentUser.id
          ).then(res => { });
          this.toastSrv.showToast('Success', "收藏成功 ", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', "收藏失敗", this.toastSrv.iconClasses.error);
        }
      });
    }

  }



  onCoverImgError(event) {
    event.target.src = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
  }

  onImgError(event) {
    event.target.src = "./../../../assets/icons/profile.png";
  }

  IsNullorEmpty(value) {
    return !this.utilitySrv.IsNullOrEmpty(value)
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
    formData.append("id", this.currentUser.id);
    formData.append("file", event.target.files[0]);

    this.userSrv.updateImage(this.currentUser.id, formData).subscribe(res => {
      if (res['result'] == 'successful') {
        this.userProfile.imageUrl = environment.assetUrl + res["data"];
      } else {
        this.userProfile.imageUrl = this.defaultProfileLogo;
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
    formData.append("id", this.currentUser.id);
    formData.append("file", event.target.files[0]);
    this.userSrv.updateCover(this.currentUser.id, formData).subscribe(res => {
      if (res['result'] == 'successful') {
        this.userProfile.cover = environment.assetUrl + res["data"];
      } else {
        this.userProfile.cover = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
      }
    })
  }

  initProfileForm() {

    let _skills = [];
    if (!this.utilitySrv.IsNullOrEmpty(this.userProfile.skills)) {
      // let _skill_values = this.userProfile.skills.split(",");

      this.skillOptions.map(option => {
        if (this.userProfile.skills.includes(option.value)) {
          _skills.push(option.text);
        }
      })
    }

    this.profileForm.setValue({
      name: this.userProfile.name,
      email: this.userProfile.email,
      position: this.userProfile.title,
      company: this.userProfile.company,
      skills: _skills,
      website: this.userProfile.website,
      facebook: this.userProfile.facebook,
      twitter: this.userProfile.twitter,
      github: this.userProfile.github,
      linkedin: this.userProfile.linkedin,
      bio: this.userProfile.bio
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onProfileSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    const values = this.profileForm.value;
    let _skills = "";
    let _skills_array = [];
    if (values.skills) {
      values.skills.map(skill => {
        let _skill_text = skill;
        if (typeof skill == "object") {
          _skill_text = skill.text;
        }
        let _index = this.skillOptions.findIndex((obj => obj.text == _skill_text));
        if (_index) {
          _skills += this.skillOptions[_index].value + ",";
          _skills_array.push(this.skillOptions[_index].value);
        }
      })

      if (_skills.length > 0) {
        _skills = _skills.substring(0, _skills.length - 1);
      }
    }
    let params = {
      "id": this.currentUser.id,
      name: values.name,
      title: values.position,
      company: values.company,
      skills: _skills,
      website: values.website,
      facebook: values.facebook,
      twitter: values.twitter,
      github: values.github,
      linkedin: values.linkedin,
      bio: values.bio
    }
    this.userSrv.updateUserBasicInfo(params).subscribe(res => {

      if (res["result"] === "successful") {
        this.userProfile.name = values.name;
        this.userProfile.title = values.position;
        this.userProfile.company = values.company;
        this.userProfile.skills = _skills_array;
        this.userProfile.website = values.website;
        this.userProfile.facebook = values.facebook;
        this.userProfile.twitter = values.twitter;
        this.userProfile.github = values.github;
        this.userProfile.linkedin = values.linkedin;
        this.userProfile.bio = values.bio;

        this.profileForm.reset();
        this.expModel = "new";
        this.closeInfobutton.nativeElement.click();
      }
    })

  }

  onExperienceSubmit() {
    this.submitted = true;
    if (this.experienceForm.invalid) {
      return;
    }
    const values = this.experienceForm.value;
    let params = {
      "id": values.id,
      "userId": this.currentUser.id,
      "position": values.position,
      "company": values.company,
      "isCurrent": values.isCurrent,
      "startYear": values.startYear,
      "startMonth": values.startMonth,
      "endYear": values.endYear,
      "endMonth": values.endMonth,
      "content": values.content
    }
    if (this.expModel == "new") {
      this.userSrv.addExperience(params).then(res => {
        if (res["result"] === "successful") {
          params["id"] = res["data"];
          this.userProfile.experience.push(params);
          this.experienceForm.reset();
          this.expModel = "new";
          this.closeExpbutton.nativeElement.click();
        }
      })
    } else {
      this.userSrv.updateExperience(params).then(res => {
        if (res["result"] === "successful") {
          let objIndex = this.userProfile.experience.findIndex((obj => obj.id == values.id));
          this.userProfile.experience[objIndex] = params;
          this.experienceForm.reset();
          this.expModel = "new";
          this.closeExpbutton.nativeElement.click();
        }
      })
    }


  }

  onAddExp() {
    this.experienceForm.reset();
  }
  onEditExp(exp) {
    this.experienceForm.setValue({
      id: exp.id,
      position: exp.position,
      company: exp.company,
      isCurrent: exp.isCurrent,
      startYear: exp.startYear,
      startMonth: exp.startMonth,
      endYear: exp.endYear,
      endMonth: exp.endMonth,
      content: exp.content,
    });
    this.expModel = "edit";

  }

  onCancelEditExp() {
    this.expModel = "new";
  }

  onDeleteExp(exp) {
    this.userSrv.deleteExperience
      (exp.id).then(res => {
        if (res["result"] === "successful") {
          let objIndex = this.userProfile.experience.findIndex((obj => obj.id == exp.id));
          this.userProfile.experience.splice(objIndex, 1)
        }
      })
  }

  onToggleChat(event) {
    this.isChat = !this.isChat;
  }

  onClickChat(event) {

    this.isChat = !this.isChat;
    this.reciver = event;
  }

  changeTab(tab) {
    this.currentTab = tab;
  }

  //feedback
  onSubmitFeedback() {
    this.submitted = true;
    if (this.feedbackForm.invalid) {
      return;
    }
    const values = this.feedbackForm.value;

    this.mentorSrv.insertComment(this.userProfile.id,
      values.comment,
      this.starRating,
      this.currentUser.id).subscribe(res => {
        if (res["result"] === "successful") {
          this.starRating = 0;
          this.userProfile.comments.push({
            content: values.content,
            createdAt: Date.now(),
            createdBy: this.currentUser.id,
            deleted: false,
            imageUrl: this.currentUser.imageUrl,
            rating: this.starRating,
            updatedAt: Date.now(),
            updatedBy: this.currentUser.id,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
          });
          this.feedbackForm.reset();
          this.commentModel = "new";
          this.closefbbutton.nativeElement.click();
          this.toastSrv.showToast('Success', "新增評語成功", this.toastSrv.iconClasses.success);
        }
      }, (error => {
        this.toastSrv.showToast('Failed', "新增評語失敗", this.toastSrv.iconClasses.error);
      }))

  }

  onEditFeedback() {

  }

  onCancelFeedback() {

  }

  imagePath(path) {

    if (this.utilitySrv.IsNullOrEmpty(path)) {
      path = this.defaultProfileLogo;
    } else {
      path = environment.assetUrl + path;
    }
    return path
  }

  onProjectImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  get g() {
    return this.experienceForm.controls;
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
