import { Component, OnInit, AfterViewInit } from '@angular/core';

import {
  DialogService,
  ProjectService,
  ToastService,
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Utility
} from '../../../_helpers';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-myproject-profile.',
  templateUrl: './myproject-profile.component.html',
  styleUrls: ['./myproject-profile.component.scss']
})
export class MyProjectProfileComponent implements OnInit, AfterViewInit {

  projectForm: FormGroup;
  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentProject = null;
  mode = "view";
  constructor(
    private utilitySrv: Utility,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private projectSrv: ProjectService,
    private authStoreSrv: AuthStore,
    private spinnerSrv: NgxSpinnerService) {
    this.currentUser = this.authStoreSrv.getUserData();
  }

  ngOnInit() {
    this.spinnerSrv.show();
    this.projectForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: [""],
      isFindPartner: [0],
      isFunding: [0],
      isCofounder: [0],
      product: [""],
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
        this.spinnerSrv.hide();
      }).then(res => {
        // this.spinnerSrv.hide();
      })
  }

  ngAfterViewInit(): void {
    // this.spinnerSrv.hide();
  }
  onStatusChange($event, property) {
    this.projectForm.get(property).setValue($event.target.checked);
  }

  getStatus() {
    let content = "";

    if (this.projectForm.value.isFindPartner) {
      content += " 徵成員中,"
    }

    if (this.projectForm.value.isFunding) {
      content += " 募資中,"
    }

    if (this.projectForm.value.isCofounder) {
      content += " 找共同創辦人,"
    }
    if (content.length > 0) {
      content = content.substring(0, content.length - 1);
    }
    return content;
  }

  getIndustryType() {
    let content = "";

    if (this.projectForm.value.type.indexOf('eComm') > 0) {
      content += " 電子商務,"
    }

    if (this.projectForm.value.type.indexOf('ai') > 0) {
      content += " 人工智慧,"
    }
    if (this.projectForm.value.type.indexOf('edutech') > 0) {
      content += " 教育科技,"
    }
    if (this.projectForm.value.type.indexOf('sharingeconomy') > 0) {
      content += " 共享經濟,"
    }
    if (this.projectForm.value.type.indexOf('medical') > 0) {
      content += " 醫學科技,"
    }
    if (this.projectForm.value.type.indexOf('transport') > 0) {
      content += " 運輸服務,"
    }
    if (this.projectForm.value.type.indexOf('fintech') > 0) {
      content += " 金融科技,"
    }
    if (this.projectForm.value.type.indexOf('game') > 0) {
      content += " 遊戲產業,"
    }
    if (this.projectForm.value.type.indexOf('platform') > 0) {
      content += " 平台,"
    }
    if (content.length > 0) {
      content = content.substring(0, content.length - 1);
    }
    return content;
  }

  getStage() {
    let content = "";

    if (this.projectForm.value.stages.indexOf('idea') > 0) {
      content += " 已有創業概念,"
    }

    if (this.projectForm.value.stages.indexOf('businessplan') > 0) {
      content += " 商業計畫初稿,"
    }

    if (this.projectForm.value.stages.indexOf('findpartner') > 0) {
      content += " 找創業夥伴,"
    }
    if (this.projectForm.value.stages.indexOf('buildMVP') > 0) {
      content += " 建構最小可行性產品(MVP),"
    }
    if (this.projectForm.value.stages.indexOf('producttested') > 0) {
      content += " 驗證產品中,"
    }
    if (this.projectForm.value.stages.indexOf('findcustomers') > 0) {
      content += " 找用戶中,"
    }
    if (this.projectForm.value.stages.indexOf('findpayingcustomers') > 0) {
      content += " 找付費用戶中,"
    }

    if (content.length > 0) {
      content = content.substring(0, content.length - 1);
    }
    return content;
  }

  onStageChange($event, value) {
    var _values = this.projectForm.get('stages').value;

    if ($event.target.checked) {
      _values += "," + value;
    } else {
      _values = _values.replace("," + value, "");
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
        this.projectMsg = "更新成功";
        this.mode = "view";
        this.toastSrv.showToast('Success', "更新成功 ", this.toastSrv.iconClasses.success);
      }
    }, error => {
      this.projectMsg = "更新失敗";
      console.error("updated error", error);
      this.toastSrv.showToast('Failed', "更新失敗", this.toastSrv.iconClasses.error);
    })
  }

  onSaveDraft() {
    this.submitted = true;
    this.projectMsg = "";
    if (this.projectForm.invalid) {
      return;
    }
    const value = this.projectForm.value;
    this.projectSrv.insertProject({
      name: value.name,
      description: value.description,
      status: 'draft',
      product: value.product,
      type: value.type,
      stage: value.stages,
      isFindPartner: value.isFindPartner,
      isFunding: value.isFunding,
      isCofounder: value.isCofounder,
      uid: this.currentUser.id
    }).subscribe(res => {

      if (res['result'] === 'successful') {
        this.projectMsg = "存草稿成功";
        this.mode = "view";
        this.toastSrv.showToast('Success', "存草稿成功 ", this.toastSrv.iconClasses.success);
      }
    }, error => {
      this.projectMsg = "存草稿失敗";
      console.error("updated error", error);
      this.toastSrv.showToast('Failed', "存草稿失敗", this.toastSrv.iconClasses.error);
    })
  }

  onEditMode() {
    if (this.mode === 'view') {
      this.mode = 'edit';
    } else {
      this.mode = 'view';
    }
  }
}
