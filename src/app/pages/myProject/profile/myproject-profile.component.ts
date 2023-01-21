import { Component, OnInit } from '@angular/core';

import {
  DialogService,
  ProjectService
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Utility
} from '../../../_helpers';

@Component({
  selector: 'app-myproject-profile.',
  templateUrl: './myproject-profile.component.html',
  styleUrls: ['./myproject-profile.component.scss']
})
export class MyProjectProfileComponent implements OnInit {

  projectForm: FormGroup;
  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentProject = null;

  constructor(
    private utilitySrv: Utility,
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
      isFunding: [0, Validators.required],
      isCofounder: [0, Validators.required],
      product: ["", Validators.required],
      type: ["", Validators.required],
      stages: ["", Validators.required],
    });
    this.currentUser = this.authStoreSrv.getUserData();
    let projectId = this.route.snapshot.paramMap.get("projectId");
    this.projectSrv.getProject(projectId,
      this.currentUser.id).then(res => {
        if (res['result'] === 'successful') {
          this.currentProject = res['data'];
          this.projectForm.setValue({
            name: this.currentProject.name,
            description: this.currentProject.description,
            isFindPartner: this.currentProject.isFindPartner,
            isFunding: this.currentProject.isFunding,
            isCofounder: this.currentProject.isCofounder,
            product: this.currentProject.product,
            type: this.currentProject.type,
            stages: this.currentProject.stage
          });
        }
      })
  }

  onStatusChange($event, property) {
    this.projectForm.get(property).setValue($event.target.checked);
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
      _values = value.replace("," + value, "");
    }
    this.projectForm.get('type').setValue(_values);
  }

  isInValue(value, types) {

    if (this.utilitySrv.IsNullOrEmpty(types)) {
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
      product: value.product,
      type: value.type,
      stage: value.stages,
      isFindPartner: value.isFindPartner,
      isFunding: value.isFunding,
      isCofounder: value.isCofounder,
      uid: this.currentUser.id
    }).subscribe(res => {

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
