import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ViewsService,
  DataService,
  AppSettingsService,
  SettingService,
  UserService
} from "../../_services";
import {
  AuthStore
} from "../../_services/auth.store";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-pub-profile",
  templateUrl: "./pubprofile.component.html",
  styleUrls: ["./pubprofile.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PubProfileComponent implements OnInit {

  @ViewChild('closeExpbutton') closeExpbutton;
  @ViewChild('closeInfobutton') closeInfobutton;

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
  expModel: string = "new";
  years: string[] = [];
  submitted = false;
  httpreg = '(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  constructor(
    private userSrv: UserService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private viewsService: ViewsService,
    private utility: Utility,
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
      if (this.utility.IsNullOrEmpty(this.currentUser.imageUrl)) {
        this.currentUser.imageUrl = this.defaultProfileLogo;
      } else {
        this.currentUser.imageUrl = environment.assetUrl + this.currentUser.imageUrl;
      }
    }
    let userId = this.route.snapshot.paramMap.get('userId');

    this.userSrv.getUserInfo(userId).then(res => {
      if (res['result'] == 'successful') {
        this.userProfile = res['data'];
        if (this.userProfile.skills != null) {
          this.userProfile.skills = this.userProfile.skills.split(",");
        }
        if (this.utility.IsNullOrEmpty(this.userProfile.imageUrl)) {
          this.userProfile.imageUrl = this.defaultProfileLogo;
        } else {
          this.userProfile.imageUrl = environment.assetUrl + this.userProfile.imageUrl;
        }
        if (!this.utility.IsNullOrEmpty(this.userProfile.cover)) {

          this.userProfile.cover = environment.assetUrl + this.userProfile.cover;
        }
        this.isOwner = (this.currentUser.id === this.userProfile.id);

        //init view
        let _id = null;
        if (this.currentUser && this.currentUser.id) {
          _id = this.currentUser.id;
          if (this.userProfile.id != this.currentUser.id) {
            this.viewsService.insert(
              this.currentUser.id,
              "user",
              _id,
              "",
              _id
            );
          }

        } else {
          this.viewsService.insert(
            this.userProfile.id,
            "user",
            _id,
            "",
            _id
          );

        }
      }
    })



  }

  onCoverImgError(event) {
    event.target.src = "https://imagizer.imageshack.com/img921/9628/VIaL8H.jpg";
  }

  onImgError(event) {
    event.target.src = "./../../../assets/icons/profile.png";
  }

  IsNullorEmpty(value) {
    return !this.utility.IsNullOrEmpty(value)
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
    if (!this.utility.IsNullOrEmpty(this.userProfile.skills)) {
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

    // this.dialogSrv.confirmThis("Are you sure you want to delete ",
    //   () => {
    //     console.log("yed ===");
    //   }, () => {
    //     console.log("No ----");
    //   });
    this.userSrv.deleteExperience
      (exp.id).then(res => {
        if (res["result"] === "successful") {
          let objIndex = this.userProfile.experience.findIndex((obj => obj.id == exp.id));
          this.userProfile.experience.splice(objIndex, 1)
        }
      })
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
