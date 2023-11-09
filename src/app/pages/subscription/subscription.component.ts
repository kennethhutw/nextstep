import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  SubscribeService,
  DataService,
  ToastService
} from "../../_services";

import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";


import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"]
})
export class SubscriptionComponent implements OnInit {


  SubscriptionCount = {
    total: '0',
    projects: '0',
    members: '0'
  };

  subForm: FormGroup;
  submitted: boolean = false;

  msg = {
    notifOp1: "訂閱新專案通知",
    notifOp2: "訂閱新會員通知",
    notifOp1Desc: "有新專案發布會收到email通知",
    notifOp2Desc: "有新會員加入會收到email通知",
    updateSuc: "",
    updateFailed: ""
  }
  currentSetting = {
    id: "",
    project: false,
    member: false
  };
  constructor(
    private utilitySrv: Utility,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    public toastSrv: ToastService,
    private fb: FormBuilder,
    private subscribeSrv: SubscribeService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.toastSrv.changeLang(this.translateSrv);
      this.init_terms(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
      this.init_terms(lang);
    });
  }

  ngOnInit() {

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.subForm = this.fb.group({
      project: [1],
      user: [1],
      email: ["", [Validators.required, Validators.pattern(emailRegex)]]
    });



    this.subscribeSrv.getCount().then(res => {
      if (res['result'] == 'successful') {
        if (res['data'].length > 0) {
          this.SubscriptionCount = {
            total: res['data'][0]['total_amount'],
            projects: res['data'][0]['projects_amount'],
            members: res['data'][0]['users_amount']
          }
        }
      }
    }).catch(error => console.error(error))

  }

  init_terms(lang) {


    this.translateSrv.get(["SUBOP1",
      "SUBOP2",
      "SUBOP1DESC",
      "SUBOP2DESC",
      "UPDATEDSUC",
      "UPDATEDFAILED"
    ]).subscribe((words: string) => {
      this.msg.notifOp1 = words["SUBOP1"];
      this.msg.notifOp2 = words["SUBOP2"];
      this.msg.notifOp1Desc = words["SUBOP1DESC"];
      this.msg.notifOp2Desc = words["SUBOP2DESC"];
      this.msg.updateSuc = words["UPDATEDSUC"];
      this.msg.updateFailed = words["UPDATEDFAILED"];
    })


  }

  get f() {
    return this.subForm.controls;
  }

  inValid() {
    return this.subForm.invalid;
  }


  onSubmit() {
    this.submitted = true;
    const values = this.subForm.value;

    if (this.subForm.invalid) {
      return;
    }

    this.subscribeSrv.insert({
      email: values.email,
      project: values.project,
      user: values.user
    }).subscribe(res => {
      if (res['result'] == 'successful') {

        this.currentSetting = {
          id: res['data'],
          project: true,
          member: true
        }
        this.submitted = false;
      }
    })


  }

  onChange($event, type) {

    if (type == 'project') {
      this.currentSetting.project = !this.currentSetting.project;
    } else {
      this.currentSetting.member = !this.currentSetting.member;
    }

    let params = {

      project: this.currentSetting.project,
      member: this.currentSetting.member,
    }
    this.subscribeSrv.update(this.currentSetting.id,
      params).then(res => {
        if (res['result'] == 'successful') {
          this.toastSrv.showToast("",
            this.msg.updateSuc,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast("",
            this.msg.updateFailed,
            this.toastSrv.iconClasses.error);
        }

      }).catch(error => {
        console.error("update failed.", error);
        this.toastSrv.showToast("",
          this.msg.updateFailed,
          this.toastSrv.iconClasses.error);
      })
  }


}
