import {
  Component,
  OnInit,
  ViewChild, ElementRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  UserService,
  AppSettingsService,
  DataService,
  ActivityService,
  ProjectService,
  NotificationService
} from "../../../_services";
import {
  FormBuilder,
  FormGroup,
  Validators
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
  projectForm: FormGroup;

  skillOptions: any[] = [];
  name: string = "";
  submitted = false;

  pro_submitted = false;

  wordCount: any;
  words = 1;
  @ViewChild("text") text: ElementRef;

  msg = {
    project: "",
    create: "",
    bio_template_statment: "",
    template_statment: ""
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthStore,
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private userSrv: UserService,
    private translateSrv: TranslateService,
    private activitySrv: ActivityService,
    private projectSrv: ProjectService,
    private appSettingsSrv: AppSettingsService,
    private formBuilder: FormBuilder,
    private notificationSrv: NotificationService
  ) {

    this.skillOptions = this.appSettingsSrv.skillOptions();
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.init_terms();
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms();
      }
    });
  }

  ngOnInit() {

    this.currentUser = this.authSrv.getUserData();
    const _regex = /([A-Za-z0-9]+)/g;
    this.profileForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')]],
      position: ["", [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')]],
      company: [""],
      bio: ["", Validators.maxLength(1000)],
      skills: [""],
      website: [""],
      github: [""],
      facebook: [""],
      twitter: [""],
      linkedin: [""],
      tags: [""],

    });

    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: [""],
      isFindPartner: [0, Validators.required],
      isFunding: [0, Validators.required],
      isCofounder: [0, Validators.required],
      product: [""],
      type: ["", Validators.required],
      stages: ["", Validators.required]
    });
  }

  init_terms() {
    this.translateSrv.get("PROJECT").subscribe((text: string) => {
      this.msg.project = text;
    });
    this.translateSrv.get("CREATE").subscribe((text: string) => {
      this.msg.create = text;
    });
    this.translateSrv.get("PROJECT_INTRO_STATEMENT").subscribe((text: string) => {
      this.msg.template_statment = text;
    });
    this.translateSrv.get("BIO_STATEMENT").subscribe((text: string) => {
      this.msg.bio_template_statment = text;
    });

  }
  get f() {
    return this.profileForm.controls;
  }

  inValid() {
    return this.profileForm.invalid;
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
          // this.router.navigate(["./dashboard"], {});
          this.step = 2;
        }
      }, error => {
        console.error("updateUserBasicInfo error ", error);
      }, () => {
        this.step = 2;
      })
    } catch (error) {
      console.log("failed", error);
    }

  }

  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }

  NextStep(value) {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.step = value;
    if (this.step === 1) {
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

  onBioTemplate() {
    this.profileForm.get("bio").setValue(this.msg.template_statment);
  }

  GoDashboard() {
    this.router.navigate(["./dashboard"], {});
  }

  get g() {
    return this.projectForm.controls;
  }

  inProjectValid() {
    return this.projectForm.invalid;
  }

  onStatusChange($event, property) {
    this.projectForm.get(property).setValue($event.target.checked);
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
      _values = _values.replace("," + value, "");
    }
    this.projectForm.get('type').setValue(_values);
  }

  isInValue(value, types) {

    if (types == "") {
      return false;
    } else {
      return types.indexOf(value) > -1;
    }
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

  onSave() {

    this.submitted = true;
    const value = this.projectForm.value;
    // stop here if form is invalid
    if (this.projectForm.invalid) {
      return;
    }
    this.saveProject('published', 0);
  }

  onTemplate() {
    this.projectForm.get("description").setValue(this.msg.template_statment);
  }

  onSaveDraft() {
    if (this.projectForm.invalid) {
      return;
    }

    this.saveProject('draft', 0);
  }

  saveProject(status, isPublic) {
    this.submitted = true;

    const value = this.projectForm.value;
    let projectName = value.name;
    this.projectSrv.insertProject({
      name: value.name,
      description: value.description,
      status: status,
      product: value.product,
      type: value.type,
      stages: value.stages,
      isPublic,
      isFindPartner: value.isFindPartner,
      isFunding: value.isFunding,
      isCofounder: value.isCofounder,
      uid: this.currentUser.id
    }).subscribe(res => {
      if (res['result'] === 'successful') {

        let projectId = res['data'];
        this.submitted = false;
        this.activitySrv.insert(this.currentUser.id,
          res['data'],
          "create",
          `${this.currentUser.name} ${this.msg.create} ${projectName} ${this.msg.project} ！`
        ).subscribe(res => {
          if (res['result'] === 'successful') { }
        });
        this.notificationSrv.insert(this.currentUser.id,
          null,
          ` ${this.msg.create}${projectName}${this.msg.project}！`,
          "1",
          '0',
          '0',
          this.currentUser.id
        ).then(res => {
          if (res['result'] === 'successful') {
            this.GoDashboard()
          }
        }).catch(error => {
          console.error("saveError", error);
        })
        //this.projectForm.reset();
      } else {

        console.error("saveError", res['error'].message);
      }

    }, (error) => {
      console.error("saveError", error);

    })
  }
}
