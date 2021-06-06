import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  DataService,
  ToastService,
  DialogService,
  SettingService,
  AuthStore
} from "../../../_services";
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { Utility } from '../../../_helpers';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})

export class AdminSettingsComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  emailsForm = this.fb.group({
    testEmail: ['', Validators.required],
    delegatingEmail: ['', Validators.required]
  });

  currentUser: any;
  settings: Array<any> = [];
  displaySettings: Array<any> = [];
  loading = true;
  dbUserEmails: Array<any> = [];

  testEmailToAdd;
  delegatingEmailToAdd;
  submitted = false;
  main_bg = "./assets/images/test.jpg";

  base64textString = [];
  BGImageFile: any;
  currentImageURL = "";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private settingSrv: SettingService,
    private fb: FormBuilder,
    private router: Router,
    private utility: Utility,
    private authStoreSrv: AuthStore,
    private toasterSrv: ToastService,
    private route: ActivatedRoute,
    private dataSrv: DataService,
    private confirmDialogService: DialogService,
  ) {


  }

  get testEmail() { return this.emailsForm.get('testEmail'); }
  get delegatingEmail() { return this.emailsForm.get('delegatingEmail'); }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    if (this.currentUser == null) {
      this.authStoreSrv.logout();
      this.router.navigate(['/']);
    }
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.settingSrv.getSettings().subscribe(result => {
      if (result['result'] === 'successful') {
        this.settings = result['data'];
        this.settings.forEach((element) => {
          if (element.value != null) {
            element.value = environment.assetUrl + element.value;
          }
        });

        this.displaySettings = this.settings;
      }
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  showToaster(success: boolean, message: string) {
    if (success) {
      this.toasterSrv.showToast('Success', message, this.toasterSrv.iconClasses.success);
    } else {
      this.toasterSrv.showToast('Failed', message, this.toasterSrv.iconClasses.error);
    }
  }

  // Deletes the entry
  deleteEmailEntry(id: any, _title: any) {
    const that = this;
    // that.delSrv.deleteDelegatingEmail(id).subscribe(res => {
    //   if (res['result'] = 'successful') {
    //     that.showToaster(true, `delete ${_title} successfully`);
    //     that.refreshTable();
    //   } else {
    //     that.showToaster(false, `delete ${_title} failed`);
    //   }
    // });


  }

  isInArray(val, arr) {
    return arr.indexOf(val) > -1;
  }

  isInvalid() {
    return (this.emailsForm.value.testEmail === '' || this.emailsForm.value.delegatingEmail === '');
  }

  // Adds a new delegating
  addEmailEntry() {
    this.submitted = true;
    this.testEmailToAdd = this.emailsForm.value.testEmail;
    this.delegatingEmailToAdd = this.emailsForm.value.delegatingEmail;

    //let duplicates = this.Settings.filter(emailEntry => (emailEntry.email === this.testEmailToAdd));

    // const emailExistsInTable = this.isInArray(this.testEmailToAdd, this.Emails);

    // this.settingSrv.insertSettings(this.testEmailToAdd, this.delegatingEmailToAdd, this.currentUser.id).subscribe(result => {
    //   if (result['result'] === 'successful') {
    //     this.showToaster(true, `${this.testEmailToAdd} added!`);
    //     this.refreshTable();
    //   } else {
    //     this.showToaster(false, `add ${this.testEmailToAdd} failed`);
    //   }
    // }, err => {
    //   this.showToaster(false, `add ${this.testEmailToAdd} failed`);
    // });

    // this.emailsForm.reset();
    this.submitted = false;
  }
  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    this.BGImageFile = evt.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {

    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));

    this.main_bg = 'data:image/png;base64,' + btoa(e.target.result);
    this.dataSrv.setPreviewBG(this.main_bg);
  }

  CleanImage() {
    this.base64textString = [];
    this.main_bg = "";
    this.BGImageFile = null;
  }

  InsertBGImage() {
    let formData = new FormData();
    formData.append("field", 'main_bg');
    formData.append("uid", this.currentUser.id);
    formData.append("enable", "0");

    formData.append("uploadfile", this.BGImageFile);

    let _fileName = this.BGImageFile.name;
    if (!this.utility.IsNullOrEmpty(this.main_bg)) {
      this.settingSrv.uploadBG(formData).subscribe(result => {
        if (result['result'] === 'successful') {
          this.showToaster(true, `${_fileName} added!`);
          this.refreshTable();
        } else {
          this.showToaster(false, `add ${_fileName} failed`);
        }
      }, err => {
        this.showToaster(false, `add ${_fileName} failed`);
      });
    } else {
      this.showToaster(false, `No image. Plesae upload a image firs.`);
    }
  }

  PreviewBGImage() {
    this.dataSrv.setPreviewBG(this.main_bg);
    this.router.navigate([]).then(result => { window.open(`/prehome/setting`, '_blank'); });
  }
  EnableSetting(id) {
    this.settingSrv.enableSetting(id, "main_bg", "1", this.currentUser.id).subscribe(result => {
      if (result['result'] === 'successful') {
        this.showToaster(true, `main_bg enable!`);
        this.refreshTable();
      } else {
        this.showToaster(false, `enable main_bg failed`);
      }
    }, err => {
      this.showToaster(false, `enable main_bg failed`);
    });
  }

  viewImage(path) {

    this.currentImageURL = path;
    this.changeDetectorRef.detectChanges();
    document.getElementById('openViewImgModalButton').click();
  }

}
