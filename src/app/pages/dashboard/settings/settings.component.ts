import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  ToastService,
  UserSettingService,
  SubscribeService
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

  currentSubSetting = {
    id: "",
    project: false,
    member: false
  };

  //UPDATEDFAILED
  msg = {

    privacyOp1: "",
    privacyOp1Desc: "",
    privacyOp2: "",
    privacyOp2Desc: "",

    notifOp1: "",
    notifOp1Desc: "",
    notifOp2: "",
    notifOp2Desc: "",
    notifOp3: "",
    notifOp3Desc: "",
    updatefailed: "",
    updateSuc: "",
    updateFailed: "",
    changePSWTitle: "",
    oldPSWWrong: "",
    notifSubOp1: "訂閱新專案通知",
    notifSubOp2: "訂閱新會員通知",
    notifSubOp1Desc: "有新專案發布會收到email通知",
    notifSubOp2Desc: "有新會員加入會收到email通知",
  }

  constructor(
    public toastSrv: ToastService,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private formBuilder: FormBuilder,
    private userSettingSrv: UserSettingService,
    private authStoreSrv: AuthStore,
    private router: Router,
    private spinnerSrv: NgxSpinnerService,
    private subscribeSrv: SubscribeService
  ) {

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
      this.msg.privacyOp1 = text;
    });
    this.translateSrv.get("PRIVACYOP1DES").subscribe((text: string) => {
      this.msg.privacyOp1Desc = text;
    });
    this.translateSrv.get("PRIVACYOP2").subscribe((text: string) => {
      this.msg.privacyOp2 = text;
    });
    this.translateSrv.get("PRIVACYOP2DES").subscribe((text: string) => {
      this.msg.privacyOp2Desc = text;
    });
    this.translateSrv.get("NOTIFOP1").subscribe((text: string) => {
      this.msg.notifOp1 = text;
    });
    this.translateSrv.get("NOTIFOP1DES").subscribe((text: string) => {
      this.msg.notifOp1Desc = text;
    });

    this.translateSrv.get("NOTIFOP2").subscribe((text: string) => {
      this.msg.notifOp2 = text;
    });
    this.translateSrv.get("NOTIFOP2DES").subscribe((text: string) => {
      this.msg.notifOp2Desc = text;
    });
    this.translateSrv.get("NOTIFOP3").subscribe((text: string) => {
      this.msg.notifOp3 = text;
    });
    this.translateSrv.get("NOTIFOP3DES").subscribe((text: string) => {
      this.msg.notifOp3Desc = text;
    });
    this.translateSrv.get("UPDATEDSUC").subscribe((text: string) => {
      this.msg.updateSuc = text;
    });

    this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
      this.msg.updateFailed = text;
    });
    this.translateSrv.get("CHANGEPSW").subscribe((text: string) => {
      this.msg.changePSWTitle = text;
    });

    this.translateSrv.get("OLDPSWERROR").subscribe((text: string) => {
      this.msg.oldPSWWrong = text;
    });

    // this.translateSrv.get("NEWPSW").subscribe((text: string) => {
    //   this.utility.SetPlaceholder("#NEWPSW", text);
    // });
    // this.translateSrv.get("CONFIRMPSW").subscribe((text: string) => {
    //   this.utility.SetPlaceholder("#CONFIRMPSW", text);
    // });

    this.translateSrv.get(["SUBOP1",
      "SUBOP2",
      "SUBOP1DESC",
      "SUBOP2DESC"
    ]).subscribe((words: string) => {
      this.msg.notifSubOp1 = words["SUBOP1"];
      this.msg.notifSubOp2 = words["SUBOP2"];
      this.msg.notifSubOp1Desc = words["SUBOP1DESC"];
      this.msg.notifSubOp2Desc = words["SUBOP2DESC"];
    })
  }


  changeTab(tab) {
    this.currentTab = tab;
  }
  ngOnInit() {
    this.spinnerSrv.show();

    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.init_terms();
    }

    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms();
      }
    });
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



    this.subscribeSrv.getByUserId(this.currentUser.id,
      this.currentUser.email).then(res => {
        if (res['result'] == 'successful') {

          this.currentSubSetting = {
            id: res['data']['id'],
            project: res['data']['project'],
            member: res['data']['member']
          }
        }
      }).catch(error => {
        console.error("cannot get setting.", error);
      }).then(() => {
        this.spinnerSrv.hide();
        this.loading = false;
      })

  }


  onChange(event, title) {

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
    this.onSavePrivacy(title);
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
    this.passwordMsg = "";
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
          //this.passwordMsg = "Updated successfully";
          this.toastSrv.showToast("",
            this.msg.updateSuc,
            this.toastSrv.iconClasses.success);
          this.submitted = false;
          this.PasswordForm.reset();
        } else {
          this.passwordMsg = res['message'];
          if ("Password is not correct" === this.passwordMsg) {
            this.passwordMsg = this.msg.oldPSWWrong;
            this.toastSrv.showToast("",
              this.passwordMsg,
              this.toastSrv.iconClasses.error);
          } else {
            this.toastSrv.showToast("",
              this.msg.updateFailed,
              this.toastSrv.iconClasses.error);
          }
        }

      }, error => {
        console.log("reset password failed", error);
        this.toastSrv.showToast("",
          this.msg.updateFailed,
          this.toastSrv.iconClasses.error);
      })
  }

  onSavePrivacy(title) {
    this.privacyMsg = "";
    let params = {
      userId: this.currentUser.id,
      displayOnline: this.currentSetting.displayOnline,
      isPublic: this.currentSetting.isPublic,
      uid: this.currentUser.id

    }

    this.userSettingSrv.update(params).subscribe(res => {
      if (res['result'] == 'successful') {
        this.toastSrv.showToast("",
          this.msg.updateSuc,
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast("",
          this.msg.updateFailed,
          this.toastSrv.iconClasses.error);
      }

    }, (error => {
      console.error("update setting failed", error);
      this.toastSrv.showToast("",
        this.msg.updateFailed,
        this.toastSrv.iconClasses.error);
    }))
  }

  onSaveNotif(title) {
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
        this.toastSrv.showToast("",
          this.msg.updateSuc,
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast("",
          this.msg.updateFailed,
          this.toastSrv.iconClasses.error);
      }

    }, (error => {
      console.error("cannot get setting.", error);
      this.toastSrv.showToast("",
        this.msg.updateFailed,
        this.toastSrv.iconClasses.error);
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

  onSubChange($event, type) {

    if (type == 'project') {
      this.currentSubSetting.project = !this.currentSubSetting.project;
    } else {
      this.currentSubSetting.member = !this.currentSubSetting.member;
    }

    let params = {

      project: this.currentSubSetting.project,
      member: this.currentSubSetting.member,
    }
    this.subscribeSrv.update(this.currentSubSetting.id,
      params).then(res => {
        if (res['result'] == 'successful') {
          this.toastSrv.showToast("",
            this.msg.updateSuc,
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast("",
            this.msg.updateFailed,
            this.toastSrv.iconClasses.error);
        }

      }).catch(error => {
        console.error("update failed.", error);
        this.toastSrv.showToast("",
          this.msg.updateFailed,
          this.toastSrv.iconClasses.error);
      })
  }

}
