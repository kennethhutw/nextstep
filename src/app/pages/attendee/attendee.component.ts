import {
  Component, OnInit,
  ViewChild,
  HostListener
} from '@angular/core';
import {
  UserService,
  DataService,
  ToastService,
  AttendeeService,
} from '../../_services';
import {
  AuthStore
} from "../../_services/auth.store";
import { Subject } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { Utility } from "../../_helpers";
import { TranslateService } from "@ngx-translate/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  Router
} from "@angular/router";
@Component({
  selector: 'app-attendee',
  templateUrl: './attendee.component.html',
  styleUrls: ['./attendee.component.scss']
})


export class AttendeeComponent implements OnInit {

  subForm: FormGroup;
  submitted: boolean = false;
  currentUser: any;
  userInfo: any;
  notFound: boolean = false;


  terms = {
    strECOMM: "",
    strPROFOUNDER: "",
    strDEVELOPER: "",
    strUI: "",
    strUX: "",
    strEVENTPARTNER: "",
    strPM: "",
    strINVESTORS: "",
    strEVENT_PURPOSE_1: "",
    strEVENT_PURPOSE_2: "",
    strEVENT_PURPOSE_3: "",
    strEVENT_PURPOSE_4: "",
    strEVENT_PURPOSE_5: "",
    strEVENT_PURPOSE_6: "",
    strEVENT_PURPOSE_7: ""
  }


  constructor(
    private router: Router,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private fb: FormBuilder,
    private attendeeSrv: AttendeeService,
    private authStoreSrv: AuthStore,
    private spinnerSrv: NgxSpinnerService
  ) { }

  ngOnInit() {


    this.currentUser = this.authStoreSrv.getUserData();


    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }

    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);

      }
    });

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.subForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern(emailRegex)]]
    });
    this.checkUser();
  }

  checkUser() {


  }

  get f() {
    return this.subForm.controls;
  }

  inValid() {
    return this.subForm.invalid;
  }

  onSubmit() {
    this.submitted = true;
    this.userInfo = null;
    this.notFound = false;
    const values = this.subForm.value;

    if (this.subForm.invalid) {
      return;
    }

    this.attendeeSrv.getByEmail(values.email).then(res => {

      console.log(res);
      if (res['result'] == 'successful') {
        if (res['data']) {
          this.userInfo = res['data'];

        } else {
          this.notFound = true;
        }

      } else {
        this.notFound = true;
      }
    })


  }

}
