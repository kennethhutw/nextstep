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


  ngOnInit() {

  }


}
