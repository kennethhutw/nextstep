import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  UserSettingService,
  DataService
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

  showPassword = false;
  showNewPassword = false;
  showReNewPassword = false;


  privacyOp1: string = "";
  privacyOp1Desc: string = "";
  privacyOp2: string = "";
  privacyOp2Desc: string = "";

  notifOp1: string = "";
  notifOp1Desc: string = "";
  notifOp2: string = "";
  notifOp2Desc: string = "";
  notifOp3: string = "";
  notifOp3Desc: string = "";

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

  init_terms() {
    this.translateSrv.get("PRIVACYOP1").subscribe((text: string) => {
      this.privacyOp1 = text;
    });
    this.translateSrv.get("PRIVACYOP1DES").subscribe((text: string) => {
      this.privacyOp1Desc = text;
    });
    this.translateSrv.get("PRIVACYOP2").subscribe((text: string) => {
      this.privacyOp2 = text;
    });
    this.translateSrv.get("PRIVACYOP2DES").subscribe((text: string) => {
      this.privacyOp2Desc = text;
    });
    this.translateSrv.get("NOTIFOP1").subscribe((text: string) => {
      this.notifOp1 = text;
    });
    this.translateSrv.get("NOTIFOP1DES").subscribe((text: string) => {
      this.notifOp1Desc = text;
    });

    this.translateSrv.get("NOTIFOP2").subscribe((text: string) => {
      this.notifOp2 = text;
    });
    this.translateSrv.get("NOTIFOP2DES").subscribe((text: string) => {
      this.notifOp2Desc = text;
    });
    this.translateSrv.get("NOTIFOP3").subscribe((text: string) => {
      this.notifOp3 = text;
    });
    this.translateSrv.get("NOTIFOP3DES").subscribe((text: string) => {
      this.notifOp3Desc = text;
    });

    this.translateSrv.get("OLDPSW").subscribe((text: string) => {
      this.utility.SetPlaceholder("#OLDPSW", text);
    });
    this.translateSrv.get("NEWPSW").subscribe((text: string) => {
      this.utility.SetPlaceholder("#NEWPSW", text);
    });
    this.translateSrv.get("CONFIRMPSW").subscribe((text: string) => {
      this.utility.SetPlaceholder("#CONFIRMPSW", text);
    });
  }


  changeTab(tab) {
    this.currentTab = tab;
  }
  ngOnInit() {
    this.spinnerSrv.show();
    this.init_terms();
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
          if ("Password is not correct" === this.passwordMsg) {
            this.passwordMsg = "密碼不符";
          }
        }

      }, error => {
        console.log("reset password failed", error);
        this.passwordMsg = "更新失敗";
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

  toggleShow() {
    this.showPassword = !this.showPassword;
  }
  toggleNewShow() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleReNewShow() {
    this.showReNewPassword = !this.showReNewPassword;
  }

  inValid() {

    const values = this.PasswordForm.value;
    let _isEmpty = this.utility.IsNullOrEmpty(values.currentPassword) && this.utility.IsNullOrEmpty(values.newPassword) && this.utility.IsNullOrEmpty(values.confirmPassword);
    return !this.f.invalid && !_isEmpty;
  }

}
