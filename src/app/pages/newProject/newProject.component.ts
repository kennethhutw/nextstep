import { HostListener, ViewEncapsulation, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DataService,
  DialogService,
  ProjectService,
  ActivityService,
  NotificationService
} from '../../_services';
import { TranslateService } from "@ngx-translate/core";
import { Utility } from "./../../_helpers";
import {
  AuthStore
} from "../../_services/auth.store";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-new-project',
  templateUrl: './newProject.component.html',
  styleUrls: ['./newProject.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class newProjectComponent implements OnInit {
  projectForm: FormGroup;
  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentStep = "basic";

  msg = {
    project: "",
    create: ""
  }

  constructor(
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    public authStoreSrv: AuthStore,
    private activitySrv: ActivityService,
    private notificationSrv: NotificationService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: [""],
      isFindPartner: [0, Validators.required],
      isFunding: [0, Validators.required],
      isCofounder: [0, Validators.required],
      product: ["", Validators.required],
      type: ["", Validators.required],
      stages: ["", Validators.required],
      members: this.fb.array([this.createMember()]),
      jobs: this.fb.array([this.createJob()]),
    });

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.init_terms();
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms();
      }
    });

  }

  try() {
    this.dialogSrv.confirmThis("you have successfully registered ",
      () => {
        console.log("yed ===");
      }, () => {
        console.log("No ----");
      });
  }

  init_terms() {
    this.translateSrv.get("PROJECT").subscribe((text: string) => {
      this.msg.project = text;
    });
    this.translateSrv.get("CREATE").subscribe((text: string) => {
      this.msg.create = text;
    });


  }

  onChangeStep(step) {
    this.currentStep = step;
  }


  get f() {
    return this.projectForm.controls;
  }
  get t() { return this.f.members as FormArray; }
  get h() { return this.f.jobs as FormArray; }

  createMember(): FormGroup {
    return this.fb.group({
      email: [''],
      position: [''],
      description: ['']
    })
  }

  createJob(): FormGroup {
    return this.fb.group({
      position: [''],
      skills: [''],
      description: ['']
    })
  }

  get members(): FormArray {
    return <FormArray>this.projectForm.get('members');
  }

  get jobs(): FormArray {
    return <FormArray>this.projectForm.get('jobs');
  }

  addMember() {
    this.members.push(this.createMember());
  }

  addJob() {
    this.jobs.push(this.createJob());
  }

  removeMember(index) {
    this.members.removeAt(index);
  }
  removeJob(index) {
    this.jobs.removeAt(index);
  }

  inValid() {
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

  onCancel() {
    this.router.navigate(['./index'], {});
  }

  onSaveDraft() {
    console.log("Draft ----");

    // stop here if form is invalid
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
        this.submitted = false;
        this.activitySrv.insert(this.currentUser.id,
          res['data'],
          "create",
          `${this.currentUser.name} ${this.msg.create}${projectName}${this.msg.project}！`
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
          if (res['result'] === 'successful') { }
        })
        this.projectForm.reset();
      } else {
        this.projectMsg = res['error'].message;
      }

    }, (error) => {
      console.error("saveError", error);
      this.projectMsg = error.message;
    })
  }

}
