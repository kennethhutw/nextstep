import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,
  AuthStore,
  ProjectService
} from '../../_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-new-project',
  templateUrl: './newProject.component.html',
  styleUrls: ['./newProject.component.css']
})
export class newProjectComponent implements OnInit {
  projectForm: FormGroup;
  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    public authStoreSrv: AuthStore) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      isFindPartner: [0, Validators.required],
      type: ["", Validators.required],
      stages: ["", Validators.required],
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

  onIsPartner(event) {
    this.isFindPartnerPanel = !this.isFindPartnerPanel;
  }
  get f() {
    return this.projectForm.controls;
  }
  inValid() {
    return this.projectForm.invalid;
  }

  onTypeChange($event, value) {
    var _values = this.projectForm.get('type').value;

    if ($event.target.checked) {
      _values += "," + value;
    } else {
      _values = value.replace("," + value, "");
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
      _values = value.replace("," + value, "");
      _values = value.replace(value, "");

    }
    this.projectForm.get('stages').setValue(_values);
  }
  onSave() {
    console.log("Save ----");
    this.submitted = true;
    const value = this.projectForm.value;
    // stop here if form is invalid
    if (this.projectForm.invalid) {
      return;
    }
    this.saveProject('published', 0);
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
    console.log("saveProject", value)
    this.projectSrv.insertProject({
      name: value.name,
      description: value.description,
      status: status,
      type: value.type,
      stages: value.stages,
      isPublic,
      isFindPartner: value.isFindPartner,
      uid: this.currentUser.id
    }).subscribe(res => {
      console.log("res ======= ", res)
      if (res['result'] === 'successful') {
        this.submitted = false;
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
