import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  UserService,
  AppSettingsService, DataService
} from "../../../_services";
import {
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { Utility } from "../../../_helpers";
import {
  AuthStore
} from "../../../_services/auth.store";
import {
  Router,
  ActivatedRoute
} from "@angular/router";
@Component({
  selector: "app-signup-info",
  templateUrl: "./info.component.html",
  styleUrls: [
    "./info.component.scss",
  ]
})
export class SignupInfoComponent implements OnInit {
  width = false;
  currentUser: any = null;
  profileImage = null;
  profileImageFile = null;
  step = 0;
  isProject = false;
  isPartner = false;
  beMentor = false;
  isMentor = false;

  profileForm: FormGroup;

  skillOptions: any[] = [];
  name: string = "";


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthStore,
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private userSrv: UserService,
    private translateSrv: TranslateService,
    private appSettingsSrv: AppSettingsService,
    private formBuilder: FormBuilder
  ) {

    this.skillOptions = this.appSettingsSrv.skillOptions();
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }

  ngOnInit() {
    this.currentUser = this.authSrv.getUserData();
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.profileForm = this.formBuilder.group({
      name: [""],
      position: [""],
      company: [""],
      bio: [""],
      skills: [""],
      website: [""],
      github: [""],
      facebook: [""],
      twitter: [""],
      linkedin: [""],
      tags: [""],

    });
  }


  get f() {
    return this.profileForm.controls;
  }

  onSelectedProject() {
    this.isProject = !this.isProject;
  }
  onSelectedPartner() {
    this.isPartner = !this.isPartner;
  }
  onSelectedBeMontor() {
    this.beMentor = !this.beMentor;
  }
  onSelectedMentor() {
    this.isMentor = !this.isMentor;
  }

  onSubmit() {
    try {
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

      let _tags = "";
      if (this.isProject) {
        _tags += "findProject,";
      }
      if (this.isPartner) {
        _tags += "findPartner,";
      }
      if (this.beMentor) {
        _tags += "beMentor,";
      }
      if (this.isMentor) {
        _tags += "findMentor,";
      }

      let formData = new FormData();
      formData.append("id", this.currentUser.id);
      formData.append("name", values.name);
      formData.append("title", values.position);
      formData.append("company", values.company);
      formData.append("skills", _skills);
      formData.append("website", values.website);
      formData.append("facebook", values.facebook);
      formData.append("twitter", values.twitter);
      formData.append("github", values.github);
      formData.append("linkedin", values.linkedin);
      formData.append("bio", values.bio);
      formData.append("tags", _tags);
      if (this.profileImageFile)
        formData.append("profileImage", this.profileImageFile);

      this.userSrv.updateUserBasicInfo(formData).subscribe(res => {
        if (res['result'] == 'successful') {
          this.router.navigate(["./dashboard"], {});
        }
      })
    } catch (error) {
      console.log("failed", error);
    }

  }



  NextStep(value) {
    this.step = value;
    if (this.step === 0) {
      this.name = this.profileForm.value.name;
    }
  }

  onDetectImage(event) {
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.profileImageFile = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.profileImage = reader.result;
    }
  }

  onRemoveImg(event) {
    this.profileImage = null;
    this.profileImageFile = null;
  }
}
