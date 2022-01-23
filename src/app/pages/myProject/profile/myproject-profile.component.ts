import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  DialogService,
  AuthStore,
  ProjectService
} from '../../../_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore) {
  }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      isFindPartner: [0, Validators.required],
      type: ["", Validators.required],
      stages: ["", Validators.required],
    });

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

}
