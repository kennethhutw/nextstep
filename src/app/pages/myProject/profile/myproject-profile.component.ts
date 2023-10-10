import { Component, OnInit, AfterViewInit } from '@angular/core';

import {
  ProjectService,
  ToastService,
  DataService
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
import { TranslateService } from "@ngx-translate/core";

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

  project_status_1: string = "";
  project_status_2: string = "";

  msg = {
    updateSuc: "",
    updateFailed: "",
    strfindMember: "",
    strfindMoney: "",
    strfindCofounder: "",
    strECOMM: "",
    strAI: "",
    strMEDICAL: "",
    strTRANSPORT: "",
    strEDUTECH: "",
    strFINTECH: "",
    strSHARINGECONOMY: "",
    strGAME: "",
    strPLATFORM: "",
    strPRORGRESS_1: "",
    strPRORGRESS_2: "",
    strPRORGRESS_3: "",
    strPRORGRESS_4: "",
    strPRORGRESS_5: "",
    strPRORGRESS_6: "",
    strPRORGRESS_7: "",
    strPRORGRESS_8: "",
  }
  constructor(
    private dataSrv: DataService,
    private translateSrv: TranslateService,
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

  init_terms() {
    this.translateSrv.get("PUBLISH").subscribe((text: string) => {
      this.project_status_1 = text;
    });
    this.translateSrv.get("RESET").subscribe((text: string) => {
      this.project_status_2 = text;
    });

    this.translateSrv.get("UPDATEDSUC").subscribe((text: string) => {
      this.msg.updateSuc = text;
    });

    this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
      this.msg.updateFailed = text;
    });

    this.translateSrv.get(["FIND_MEMBER",
      "FIND_MONEY",
      "FIND_COFOUNDER",
      "ECOMM",
      "AI",
      "MEDICAL",
      "TRANSPORT",
      "EDUTECH",
      "FINTECH",
      "SHARINGECONOMY",
      "GAME",
      "PLATFORM",
      "PRORGRESS_1",
      "PRORGRESS_2",
      "PRORGRESS_3",
      "PRORGRESS_4",
      "PRORGRESS_5",
      "PRORGRESS_6",
      "PRORGRESS_7",
      "PRORGRESS_8",
    ]).subscribe((words: string) => {
      this.msg.strfindMoney = words["FIND_MONEY"];
      this.msg.strfindMember = words["FIND_MEMBER"];
      this.msg.strfindCofounder = words["FIND_COFOUNDER"];
      this.msg.strECOMM = words["ECOMM"];
      this.msg.strAI = words["AI"];
      this.msg.strMEDICAL = words["MEDICAL"];
      this.msg.strTRANSPORT = words["TRANSPORT"];
      this.msg.strEDUTECH = words["EDUTECH"];
      this.msg.strFINTECH = words["FINTECH"];
      this.msg.strSHARINGECONOMY = words["SHARINGECONOMY"];
      this.msg.strGAME = words["GAME"];
      this.msg.strPLATFORM = words["PLATFORM"];
      this.msg.strPRORGRESS_1 = words["PRORGRESS_1"];
      this.msg.strPRORGRESS_2 = words["PRORGRESS_2"];
      this.msg.strPRORGRESS_3 = words["PRORGRESS_3"];
      this.msg.strPRORGRESS_4 = words["PRORGRESS_4"];
      this.msg.strPRORGRESS_5 = words["PRORGRESS_5"];
      this.msg.strPRORGRESS_6 = words["PRORGRESS_6"];
      this.msg.strPRORGRESS_7 = words["PRORGRESS_7"];
      this.msg.strPRORGRESS_8 = words["PRORGRESS_8"];

    });
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
      content += ` ${this.msg.strfindMember},`
    }

    if (this.projectForm.value.isFunding) {
      content += ` ${this.msg.strfindMoney},`
    }

    if (this.projectForm.value.isCofounder) {
      content += ` ${this.msg.strfindCofounder},`
    }
    if (content.length > 0) {
      content = content.substring(0, content.length - 1);
    }
    return content;
  }

  getIndustryType() {
    let content = "";

    if (this.projectForm.value.type.indexOf('eComm') > -1) {
      content += ` ${this.msg.strECOMM},`
    }

    if (this.projectForm.value.type.indexOf('ai') > -1) {
      content += ` ${this.msg.strAI},`
    }
    if (this.projectForm.value.type.indexOf('edutech') > -1) {
      content += ` ${this.msg.strEDUTECH},`
    }
    if (this.projectForm.value.type.indexOf('sharingeconomy') > -1) {
      content += ` ${this.msg.strSHARINGECONOMY},`
    }
    if (this.projectForm.value.type.indexOf('medical') > -1) {
      content += ` ${this.msg.strMEDICAL},`
    }
    if (this.projectForm.value.type.indexOf('transport') > -1) {
      content += ` ${this.msg.strTRANSPORT},`
    }
    if (this.projectForm.value.type.indexOf('fintech') > -1) {
      content += ` ${this.msg.strFINTECH},`
    }
    if (this.projectForm.value.type.indexOf('game') > -1) {
      content += ` ${this.msg.strGAME},`
    }
    if (this.projectForm.value.type.indexOf('platform') > -1) {
      content += ` ${this.msg.strPLATFORM},`
    }
    if (content.length > 0) {
      content = content.substring(0, content.length - 1);
    }
    return content;
  }

  getStage() {
    let content = "";
    if (this.projectForm.value.stages.indexOf('idea') > -1) {
      content += ` ${this.msg.strPRORGRESS_1},`
    }

    if (this.projectForm.value.stages.indexOf('businessplan') > -1) {
      content += ` ${this.msg.strPRORGRESS_2},`
    }

    if (this.projectForm.value.stages.indexOf('findpartner') > -1) {
      content += ` ${this.msg.strPRORGRESS_3},`
    }
    if (this.projectForm.value.stages.indexOf('buildMVP') > -1) {
      content += ` ${this.msg.strPRORGRESS_4},`
    }
    if (this.projectForm.value.stages.indexOf('producttested') > -1) {
      content += ` ${this.msg.strPRORGRESS_5},`
    }
    if (this.projectForm.value.stages.indexOf('findcustomers') > -1) {
      content += ` ${this.msg.strPRORGRESS_6},`
    }
    if (this.projectForm.value.stages.indexOf('findpayingcustomers') > -1) {
      content += ` ${this.msg.strPRORGRESS_7},`
    }
    if (this.projectForm.value.stages.indexOf('fundraising') > -1) {
      content += ` ${this.msg.strPRORGRESS_8},`
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
      stages: value.stages,
      isFindPartner: value.isFindPartner,
      isFunding: value.isFunding,
      isCofounder: value.isCofounder,
      uid: this.currentUser.id
    }).subscribe(res => {

      if (res['result'] === 'successful') {
        this.projectMsg = this.msg.updateSuc;
        this.mode = "view";
        this.toastSrv.showToast('Success', this.projectMsg, this.toastSrv.iconClasses.success);
      }
    }, error => {
      this.projectMsg = this.msg.updateFailed;
      console.error("updated error", error);
      this.toastSrv.showToast('Failed', this.projectMsg, this.toastSrv.iconClasses.error);
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
