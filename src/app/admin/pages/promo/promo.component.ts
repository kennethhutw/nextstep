import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  DelegateEmailService,
  ToastService,
  DialogService,
  PromoService
} from "../../../_services";
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { Utility } from 'src/app/_helpers';


@Component({
  selector: 'app-admin-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css'],
})
export class AdminPromoComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  promoForm = this.fb.group({
    email: ['', Validators.required],
    type: ['', Validators.required]
  });

  currentUser: any;
  promos: Array<any> = [];
  loading = true;

  submitted = false;
  codeType = "0"
  newCode = "";
  editCodeId = "";

  codeForm = this.fb.group({
    email: [''],
    userId: ['']
  });

  constructor(

    private fb: FormBuilder,
    private router: Router,
    private utility: Utility,
    private promoSrv: PromoService,
    private toasterSrv: ToastService,
    private route: ActivatedRoute,
    private confirmDialogService: DialogService,
  ) {


  }

  get promoEmail() { return this.promoForm.get('email'); }
  get delegatingEmail() { return this.promoForm.get('delegatingEmail'); }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.promoSrv.getAllPromo().subscribe(result => {
      if (result['result'] === 'successful') {
        this.promos = result['data'];
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
  deletecode(id: any, title: string) {
    const that = this;

    this.confirmDialogService.confirmThis('Are you sure you want to delete?',
      () => {
        that.promoSrv.deleletCode(id).subscribe(res => {
          if (res['result'] = 'successful') {
            that.showToaster(true, `delete ${title} successfully`);
            that.refreshTable();
          } else {
            that.showToaster(false, `delete ${title} failed`);
          }
        });
      }, () => {
        console.log("No ----");
      });

  }

  isInArray(val, arr) {
    return arr.indexOf(val) > -1;
  }


  onChange(value) {
    this.codeType = value;
  }

  // Adds a new delegating
  createCode() {
    this.submitted = true;
    this.newCode = "";

    // const emailExistsInTable = this.isInArray(this.testEmailToAdd, this.Emails);

    this.promoSrv.generateCode(this.codeType).subscribe(res => {
      if (res['result'] === 'successful') {
        this.newCode = res["data"];

        this.showToaster(true, `${this.newCode} added!`);
        this.refreshTable();
        this.promoForm.reset();
      } else {
        this.showToaster(false, `add ${this.newCode} failed`);
      }
    }, err => {
      this.showToaster(false, `add ${this.newCode} failed`);
    });


    this.submitted = false;
  }

  editCode(id) {
    this.editCodeId = id;
  }

  updateCode() {


    this.promoSrv.updateCode(this.editCodeId,
      this.codeForm.value.email
      , this.codeForm.value.userId).subscribe(res => {
        if (res['result'] = 'successful') {
          this.showToaster(true, `update ${this.editCodeId} successfully`);
          this.editCodeId = "";
          this.refreshTable();
        } else {
          this.showToaster(false, `update ${this.editCodeId} failed`);
        }
      });

  }
}
