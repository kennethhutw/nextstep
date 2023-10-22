import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  DelegateEmailService,
  ToastService,
  DialogService
} from "../../../_services";
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { Utility } from 'src/app/_helpers';
import {
  AuthStore
} from "../../../_services/auth.store";

@Component({
  selector: 'app-admin-delegate-email',
  templateUrl: './delegate-email.component.html',
  styleUrls: ['./delegate-email.component.scss'],
})
export class AdminDelegateEmailComponent implements OnInit {

  dtTrigger: Subject<any> = new Subject<any>();

  emailsForm = this.fb.group({
    testEmail: ['', Validators.required],
    delegatingEmail: ['', Validators.required]
  });

  currentUser: any;
  Emails: Array<any> = [];
  loading = true;
  dbUserEmails: Array<any> = [];

  testEmailToAdd;
  delegatingEmailToAdd;
  submitted = false;

  constructor(

    private fb: FormBuilder,
    private router: Router,
    private utility: Utility,
    private authStoreSrv: AuthStore,
    private delSrv: DelegateEmailService,
    private toasterSrv: ToastService,
    private route: ActivatedRoute,
    private confirmDialogService: DialogService,
  ) {


  }

  get testEmail() { return this.emailsForm.get('testEmail'); }
  get delegatingEmail() { return this.emailsForm.get('delegatingEmail'); }


  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.delSrv.getAll().subscribe(result => {
      if (result['result'] === 'successful') {
        this.Emails = result['data'];
      }
      this.loading = false;
    });
  }

  showToaster(success: boolean, message: string) {
    if (success) {
      this.toasterSrv.showToast("", message, this.toasterSrv.iconClasses.success);
    } else {
      this.toasterSrv.showToast("", message, this.toasterSrv.iconClasses.error);
    }
  }

  // Deletes the entry
  deleteEmailEntry(id: any, _title: any) {
    const that = this;
    that.delSrv.deleteDelegatingEmail(id).subscribe(res => {
      if (res['result'] = 'successful') {
        that.showToaster(true, `delete ${_title} successfully`);
        that.refreshTable();
      } else {
        that.showToaster(false, `delete ${_title} failed`);
      }
    });


  }



  // Adds a new delegating
  addEmailEntry() {
    this.submitted = true;
    this.testEmailToAdd = this.emailsForm.value.testEmail;
    this.delegatingEmailToAdd = this.emailsForm.value.delegatingEmail;

    let duplicates = this.Emails.filter(emailEntry => (emailEntry.email === this.testEmailToAdd));

    // const emailExistsInTable = this.isInArray(this.testEmailToAdd, this.Emails);

    this.delSrv.createDelegatingEmail(this.testEmailToAdd, this.delegatingEmailToAdd, this.currentUser.id).subscribe(result => {
      if (result['result'] === 'successful') {
        this.showToaster(true, `${this.testEmailToAdd} added!`);
        this.refreshTable();
      } else {
        this.showToaster(false, `add ${this.testEmailToAdd} failed`);
      }
    }, err => {
      this.showToaster(false, `add ${this.testEmailToAdd} failed`);
    });

    this.emailsForm.reset();
    this.submitted = false;
  }


  isInvalid() {
    return (this.emailsForm.value.testEmail === '' || this.emailsForm.value.delegatingEmail === '');
  }

}
