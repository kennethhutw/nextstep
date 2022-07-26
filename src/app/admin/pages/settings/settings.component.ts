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
  SettingService
} from "../../../_services";
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { Utility } from '../../../_helpers';
import { environment } from './../../../../environments/environment';
import {
  AuthStore
} from "../../../_services/auth.store";
@Component({
  selector: 'app-admin-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})

export class AdminSettingsComponent implements OnInit, OnDestroy {

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
  main_bg = "./assets/images/home1.jpg";

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


  ngOnInit() {

  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }


}
