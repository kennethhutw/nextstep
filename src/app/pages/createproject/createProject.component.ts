import { HostListener, ViewEncapsulation, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DataService,
  DialogService,
  ProjectService,
  ActivityService,
  NotificationService
} from '../../_services';
import {
  AuthStore
} from "../../_services/auth.store";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentCanDeactivate } from "../../_guards";
import { Observable } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";
import { Utility } from "./../../_helpers";
@Component({
  selector: 'app-create-project',
  templateUrl: './createProject.component.html',
  styleUrls: ['./createProject.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProjectComponent implements OnInit, ComponentCanDeactivate {
  projectForm: FormGroup;
  isFindPartnerPanel: boolean = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentStep = "basic";
  isSaveChange = true;

  msg = {
    project: "",
    create: ""
  }

  constructor(
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService,
    private projectSrv: ProjectService,
    public authStoreSrv: AuthStore,
    private activitySrv: ActivityService,
    private notificationSrv: NotificationService) {
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
      stages: ["", Validators.required]
    });

    this.projectForm.controls['name'].valueChanges.subscribe(value => {
      this.isSaveChange = false;
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

  init_terms() {
    this.translateSrv.get("PROJECT").subscribe((text: string) => {
      this.msg.project = text;
    });
    this.translateSrv.get("CREATE").subscribe((text: string) => {
      this.msg.create = text;
    });


  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    // const result = this.dialogSrv.confirmThis("您有未保存的更改。 按取消返回並保存這些更改，或按確定放棄這些更改。 ",
    //   () => {
    //     return true;

    //   }, () => {
    //     return false;
    //   }).first();;
    // console.log("result========", result);
    //console.log("checkAuthentication========", this.checkAuthentication());
    return this.isSaveChange;
  }

  async checkAuthentication() {
    // Implement your authentication in authService
    return await this.dialogSrv.confirmThis("您有未保存的更改。 按取消返回並保存這些更改，或按確定放棄這些更改。 ",
      () => {
        return true;
      }, () => {
        return false;
      });

  }

  onChangeStep(step) {
    this.currentStep = step;
  }


  get f() {
    return this.projectForm.controls;
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
    this.isSaveChange = true;
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
        this.isSaveChange = true;
        let projectId = res['data'];
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
          if (res['result'] === 'successful') {
            this.router.navigate([`./myproject/${projectId}/profile`], {});
          }
        }).catch(error => {
          this.router.navigate([`./myproject/${projectId}/profile`], {});
        })
        //this.projectForm.reset();
      } else {
        this.projectMsg = res['error'].message;
      }

    }, (error) => {
      console.error("saveError", error);
      this.projectMsg = error.message;
    })
  }

}
