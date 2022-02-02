import { Component, OnInit } from '@angular/core';

import {
  DialogService,
  AuthStore,
  ProjectService
} from '../../../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-myproject-profile.',
  templateUrl: './myproject-profile.component.html',
  styleUrls: ['./myproject-profile.component.css']
})
export class MyProjectProfileComponent implements OnInit {

  projectForm: FormGroup;
  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentProject = null;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
    this.currentUser = this.authStoreSrv.getUserData();
  }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      isFindPartner: [0, Validators.required],
      type: ["", Validators.required],
      stages: ["", Validators.required],
    });
    let projectId = this.route.snapshot.paramMap.get("projectId");
    this.projectSrv.getProject(projectId).then(res => {
      if (res['result'] === 'successful') {
        this.currentProject = res['data'];
        this.projectForm.setValue({
          name: this.currentProject.name,
          description: this.currentProject.description,
          isFindPartner: this.currentProject.isFindPartner,
          type: this.currentProject.type,
          stages: this.currentProject.stage
        });
      }
    })
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
  get f() {
    return this.projectForm.controls;
  }
  inValid() {
    return this.projectForm.invalid;
  }

  onSave() {
    this.submitted = true;
    this.projectMsg = "";
    if (this.projectForm.invalid) {
      return;
    }
    const value = this.projectForm.value;
    this.projectSrv.update(this.currentProject.id, {
      name: value.name,
      description: value.description,
      status: 'published',
      type: value.type,
      stage: value.stages,
      uid: this.currentUser.id
    }).subscribe(res => {
      console.log("==============", res);
      if (res['result'] === 'successful') {
        this.projectMsg = "Update successfully.";
      }
    }, error => {
      this.projectMsg = "Update failed.";
      console.error("updated error", error);
    })
  }

  onSaveDraft() {

  }
}
