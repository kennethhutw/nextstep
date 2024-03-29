import {
  Component, OnInit,
  ViewChild,
  HostListener
} from '@angular/core';
import {
  UserService,
  ToastService,
  AttendeeService,
  ConfirmDialogService,
} from '../../../../_services';
import {

  ActivatedRoute
} from "@angular/router";
import { Utility } from "../../../../_helpers";
import { TranslateService } from "@ngx-translate/core";
import {
  AuthStore
} from "../../../../_services/auth.store";

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-new-Attendees',
  templateUrl: './adminNewAttendee.component.html',
  styleUrls: ['./adminNewAttendee.component.scss'],

})
export class AdminNewAttendeeComponent implements OnInit {

  attendeeForm: FormGroup;
  isLoading = true;
  currentUser: any;
  editedAttendee: any;
  msg: string;
  submitted = false;


  constructor(
    private toastSrv: ToastService,
    private route: ActivatedRoute,
    private attendeeSrv: AttendeeService,
    private authStoreSrv: AuthStore,
    private formBuilder: FormBuilder,
    private translateSrv: TranslateService,
    private utilitySrv: Utility
  ) { }

  ngOnInit() {

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);

    }
    this.currentUser = this.authStoreSrv.getUserData();

    this.attendeeForm = this.formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      email: [""],
      contact: [""],
      roles: [""],
      otherrole: [""],
      introduce: [""],
      event_date: ["20240126"],
      otherpurpose: [""],
      purposes: [""],
      isShare: [1, Validators.required],
      proj_name: [""],
      proj_introd: [""],
      suggestion: [""]
    });

    this.route.params.subscribe(params => {
      const _uid = params["id"];
      if (_uid) {
        this.attendeeSrv.getUserBasicInfo(_uid).then(res => {

          if (res["result"] === "successful") {
            this.editedAttendee = res["data"];

            this.attendeeForm.setValue({
              id: this.editedAttendee.id,
              name: this.editedAttendee.name,
              email: this.editedAttendee.email,
              contact: this.editedAttendee.contact,
              roles: this.editedAttendee.roles,
              otherrole: this.editedAttendee.otherrole,
              introduce: this.editedAttendee.introduce,
              event_date: this.editedAttendee.event_date,
              otherpurpose: this.editedAttendee.otherpurpose,
              purposes: this.editedAttendee.purposes,
              isShare: this.editedAttendee.isShare,
              proj_name: this.editedAttendee.proj_name,
              proj_introd: this.editedAttendee.proj_introd,
              suggestion: this.editedAttendee.suggestion
            });
          }
        }
        ).catch(error => {
          console.error(` get data error`, error);
        });
      }
    })

  }

  get f() {
    return this.attendeeForm.controls;
  }
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event

  }


  rerender(): void {

  }

  onIsShareChange($event) {
    this.attendeeForm.get('isShare').setValue(!$event.target.checked);
  }

  onRoleChange($event, value) {
    var _values = this.attendeeForm.get('roles').value;

    if ($event.target.checked) {
      _values += "," + value;
    } else {
      _values = _values.replace("," + value, "");
    }
    this.attendeeForm.get('roles').setValue(_values);
  }

  onPurposesChange($event, value) {
    var _values = this.attendeeForm.get('purposes').value;

    if ($event.target.checked) {
      _values += "," + value;
    } else {
      _values = _values.replace("," + value, "");

    }
    this.attendeeForm.get('purposes').setValue(_values);
  }

  isInValue(value, types) {

    if (!types)
      return false;

    if (types == "") {
      return false;
    } else {
      const result = types.indexOf(value) > -1;
      return result;
    }
  }

  inValid() {
    return this.attendeeForm.invalid;
  }

  onSubmit() {
    this.submitted = true;

    const values = this.attendeeForm.value;
    this.msg = "";
    // stop here if form is invalid
    if (this.attendeeForm.invalid) {
      return;
    }
    values.uid = this.currentUser.id;
    if (!this.editedAttendee) {
      this.insert(values);
    } else {
      this.update(values);
    }
  }

  insert(values) {
    try {
      this.attendeeSrv.insert(values).subscribe(res => {
        if (res['result'] === 'successful') {

          this.submitted = false;
          this.toastSrv.showToast('',
            "insert successfully ",
            this.toastSrv.iconClasses.success);
          this.msg = "insert successfully ";
          this.attendeeForm.reset();
          this.attendeeForm.get('purposes').setValue("");
          this.attendeeForm.get('roles').setValue("");
          this.attendeeForm.get('isShare').setValue(1);
          this.attendeeForm.get('event_date').setValue("20240126");
        } else {
          this.msg = "insert failed ";
          this.msg = res['error'].message;
          this.toastSrv.showToast('',
            "insert failed ",
            this.toastSrv.iconClasses.error);
        }

      }, (error) => {
        console.error("saveError", error);
        this.msg = error.message;
      }, () => {
        this.submitted = false;
      })
    } catch (error) {
      this.msg = "insert failed : " + error.message;
    }
  }

  update(values) {
    try {
      this.attendeeSrv.updateInfo(this.editedAttendee.id, values).subscribe(res => {
        if (res['result'] === 'successful') {

          this.submitted = false;
          this.toastSrv.showToast('',
            "update successfully ",
            this.toastSrv.iconClasses.success);
          this.msg = "update successfully ";
          this.attendeeForm.reset();
          this.attendeeForm.get('purposes').setValue("");
          this.attendeeForm.get('roles').setValue("");
          this.attendeeForm.get('isShare').setValue(1);


        } else {
          this.msg = "update failed ";
          this.msg = res['error'].message;
          this.toastSrv.showToast('',
            "update failed ",
            this.toastSrv.iconClasses.error);
        }

      }, (error) => {
        console.error("updated Error", error);
        this.msg = error.message;
      }, () => {
        this.submitted = false;
      })
    } catch (error) {
      this.msg = "update failed : " + error.message;
    }
  }


}
