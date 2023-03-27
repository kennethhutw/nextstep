import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  UserSettingService,

} from "../../../_services";
import {
  AuthStore
} from "../../../_services/auth.store";
import { Utility } from "../../../_helpers";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  PasswordForm: FormGroup;
  loading = true;
  submitted = false;
  currentTab = 'privacy';
  currentUser: any;
  currentSetting = {
    displayOnline: false,
    isPublic: false,
    notiFollow: false,
    notiMsg: false,
    notiSystem: false,
  };
  privacyMsg = "";
  notifMsg = "";
  passwordMsg = "";
  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private formBuilder: FormBuilder,
    private userSettingSrv: UserSettingService,
    private authStoreSrv: AuthStore,
    private router: Router,
    private spinnerSrv: NgxSpinnerService
  ) {
    //['', [Validators.required, Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]
    this.PasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.currentUser = this.authStoreSrv.getUserData();
    if (this.currentUser == null) {
      this.authStoreSrv.logout();
      this.router.navigate(['/']);
    }

  }



  changeTab(tab) {
    this.currentTab = tab;
  }
  ngOnInit() {
    this.spinnerSrv.show();
    // let _lang = localStorage.getItem("lang");
    // if (!this.utility.IsNullOrEmpty(_lang)) {
    //   this.translateSrv.use(_lang);
    //   this.initTags(_lang);
    // } else {
    //   let _browserLang = this.translateSrv.getBrowserLang();
    //   this.translateSrv.use(_browserLang);
    //   this.initTags(_browserLang);
    // }
    // this.dataSrv.langKey.subscribe((lang) => {
    //   if (!this.utility.IsNullOrEmpty(lang)) {
    //     this.translateSrv.use(lang);
    //     this.initTags(lang);
    //   }
    // });
    this.userSettingSrv.getByUserId(this.currentUser.id).then(res => {
      if (res['result'] == 'successful') {
        let _setting = res['data'];
        if (!this.utility.IsNullOrEmpty(_setting.displayOnline)) {
          this.currentSetting.displayOnline = _setting.displayOnline;
        }
        if (!this.utility.IsNullOrEmpty(_setting.isPublic)) {
          this.currentSetting.isPublic = _setting.isPublic;
        }
        if (!this.utility.IsNullOrEmpty(_setting.notiFollow)) {
          this.currentSetting.notiFollow = _setting.notiFollow;
        }
        if (!this.utility.IsNullOrEmpty(_setting.notiMsg)) {
          this.currentSetting.notiMsg = _setting.notiMsg;
        }
        if (!this.utility.IsNullOrEmpty(_setting.notiSystem)) {
          this.currentSetting.notiSystem = _setting.notiSystem;
        }
      }
    }).catch(error => {
      console.error("cannot get setting.", error);
    }).then(() => {
      this.spinnerSrv.hide();
      this.loading = false;
    })


  }


  onChange(event) {

    switch (event.id) {
      case "displayOnline":
        this.currentSetting.displayOnline = event.value;

        break;
      case "isPublic":
        this.currentSetting.isPublic = event.value;
        break;
      case "notiFollow":
        this.currentSetting.notiFollow = event.value;
        break;
      case "notiMsg":
        this.currentSetting.notiMsg = event.value;
        break;
      case "notiSystem":
        this.currentSetting.notiSystem = event.value;
        break;
    }
    this.onSavePrivacy();
  }

  get f() {
    return this.PasswordForm.controls;
  }
  checkPasswords() {

    let pass = this.PasswordForm.get('newPassword').value;
    let confirmPass = this.PasswordForm.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  onResetPassword() {
    this.submitted = true;
    if (this.PasswordForm.invalid) {
      return;
    }
    const values = this.PasswordForm.value;
    this.userSettingSrv.resetPassword(this.currentUser.id,
      {
        oldpassword: values.currentPassword,
        newpassword: values.newPassword
      }).subscribe(res => {

        if (res['result'] == 'successful') {
          this.passwordMsg = "Updated successfully";
          this.submitted = false;
          this.PasswordForm.reset();
        } else {
          this.passwordMsg = res['message'];
        }
      }, error => {
        console.log("reset password failed", error);
        this.passwordMsg = "Updated failed";
      })
  }

  onSavePrivacy() {
    this.privacyMsg = "";
    let params = {
      userId: this.currentUser.id,
      displayOnline: this.currentSetting.displayOnline,
      isPublic: this.currentSetting.isPublic,
      uid: this.currentUser.id

    }

    this.userSettingSrv.update(params).subscribe(res => {
      if (res['result'] == 'successful') {
        this.privacyMsg = "Updated successfully";
      } else {
        this.privacyMsg = "Update failed";
      }

    }, (error => {
      console.error("cannot get setting.", error);
      this.privacyMsg = "Update failed";
    }))
  }

  onSaveNotif() {
    this.notifMsg = "";
    let params = {
      userId: this.currentUser.id,
      notiFollow: this.currentSetting.notiFollow,
      notiMsg: this.currentSetting.notiMsg,
      notiSystem: this.currentSetting.notiSystem,
      uid: this.currentUser.id
    }
    this.userSettingSrv.update(params).subscribe(res => {
      if (res['result'] == 'successful') {
        this.notifMsg = "Updated successfully";
      } else {
        this.notifMsg = "Update failed";
      }

    }, (error => {
      console.error("cannot get setting.", error);
      this.notifMsg = "Update failed";
    }))
  }
}
