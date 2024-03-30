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
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import {
  Router
} from "@angular/router";
import { Subject } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { Utility } from "../../../_helpers";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss']
})
export class AttendeesComponent implements OnInit {


  users: Array<any> = [];
  displayUsers: Array<any> = [];
  isLoading = true;
  currentUser: any;

  foundItemNum: number = -1;
  selectedItem = null;

  searchUserName = '';


  terms = {
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

  filterCondition = {
    isProFounder: false,
    isDeveloper: false,
    isUI: false,
    isUX: false,
    isPM: false,
    isInvestors: false,
    isRoleOthers: false,
    isEvent_purpose_1: false,
    isEvent_purpose_2: false,
    isEvent_purpose_3: false,
    isEvent_purpose_4: false,
    isEvent_purpose_5: false,
    isEvent_purpose_6: false,
    isEvent_purpose_7: false,
    isEvent_purpose_8: false
  }

  constructor(
    private router: Router,
    private toastSrv: ToastService,
    private dataSrv: DataService,
    private translateSrv: TranslateService,
    private utilitySrv: Utility,
    private attendeeSrv: AttendeeService,
    private authStoreSrv: AuthStore,
    private spinnerSrv: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinnerSrv.show();

    this.currentUser = this.authStoreSrv.getUserData();
    this.getAllUser();

    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.init_terms();
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms();
      }
    });
    this.checkUser();
  }

  onCleanClick() {
    this.filterCondition.isProFounder = false,
      this.filterCondition.isDeveloper = false,
      this.filterCondition.isUI = false,
      this.filterCondition.isUX = false,
      this.filterCondition.isPM = false,
      this.filterCondition.isInvestors = false,
      this.filterCondition.isRoleOthers = false,
      this.filterCondition.isEvent_purpose_1 = false,
      this.filterCondition.isEvent_purpose_2 = false,
      this.filterCondition.isEvent_purpose_3 = false,
      this.filterCondition.isEvent_purpose_4 = false,
      this.filterCondition.isEvent_purpose_5 = false,
      this.filterCondition.isEvent_purpose_6 = false,
      this.filterCondition.isEvent_purpose_7 = false,
      this.filterCondition.isEvent_purpose_8 = false;
    this.displayUsers = this.users;
    this.foundItemNum = -1;

  }

  checkUser() {

    // const _data = localStorage.getItem("attendess");
    // if (!this.currentUser || !_data) {

    // } else {
    //   this.router.navigate(["./events"], {});
    // }
    // if (!this.currentUser) {
    //   this.router.navigate(["./events"], {});
    //   console.log("no user =================")
    // }
    // const _data = localStorage.getItem("attendess");
    // if (!_data) {
    //   this.router.navigate(["./events"], {});
    // }
  }



  init_terms() {
    this.translateSrv.get([
      "PROFOUNDER",
      "DEVELOPER",
      "UI",
      "UX",
      "EVENTPARTNER",
      "PM",
      "INVESTORS",
      "EVENT_PURPOSE_1",
      "EVENT_PURPOSE_2",
      "EVENT_PURPOSE_3",
      "EVENT_PURPOSE_4",
      "EVENT_PURPOSE_5",
      "EVENT_PURPOSE_6",
      "EVENT_PURPOSE_7"

    ]).subscribe((words: string) => {

      this.terms.strPROFOUNDER = words["PROFOUNDER"];
      this.terms.strDEVELOPER = words["DEVELOPER"];
      this.terms.strUI = words["UI"];
      this.terms.strUX = words["UX"];
      this.terms.strEVENTPARTNER = words["EVENTPARTNER"];
      this.terms.strPM = words["PM"];
      this.terms.strINVESTORS = words["INVESTORS"];
      this.terms.strEVENT_PURPOSE_1 = words["EVENT_PURPOSE_1"];
      this.terms.strEVENT_PURPOSE_2 = words["EVENT_PURPOSE_2"];
      this.terms.strEVENT_PURPOSE_3 = words["EVENT_PURPOSE_3"];
      this.terms.strEVENT_PURPOSE_4 = words["EVENT_PURPOSE_4"];
      this.terms.strEVENT_PURPOSE_5 = words["EVENT_PURPOSE_5"];
      this.terms.strEVENT_PURPOSE_6 = words["EVENT_PURPOSE_6"];
      this.terms.strEVENT_PURPOSE_7 = words["EVENT_PURPOSE_7"];


    });
  }

  getAllUser() {
    this.attendeeSrv.getAllUser().subscribe(res => {

      this.users = res['data'];
      if (this.users.length > 0) {
        this.users.forEach(element => {

          if (!this.utilitySrv.IsNullOrEmpty(element.roles)) {
            let _roles = element.roles.split(',');
            element.displayRoles = this.displayRoles(_roles, element.otherrole)

          }
          if (!this.utilitySrv.IsNullOrEmpty(element.purposes)) {
            let _purposes = element.purposes.split(',');
            element.displayPurposes = this.displayPurpose(_purposes, element.otherpurpose)
          }
          if (!this.utilitySrv.IsNullOrEmpty(element.introduce)) {
            element.introduce = this.urlify(element.introduce);
          }

          if (!this.utilitySrv.IsNullOrEmpty(element.proj_introd)) {
            element.proj_introd = this.urlify(element.proj_introd);
          }

        });
      }
      this.displayUsers = this.users;
    }, error => {
      console.error("Get all users failed :", error);
    }, () => {
      this.spinnerSrv.hide();
    });
  }


  displayRoles(roles, otherrole) {

    if (!roles) {
      return "";
    }
    if (roles.length == 0) {
      return "";
    }
    let _roles = "";

    roles.forEach(element => {
      if (element == "1") {
        _roles += this.terms.strPROFOUNDER + ";";
      }
      if (element == "2") {
        _roles += this.terms.strDEVELOPER + ";";
      }
      if (element == "3") {
        _roles += this.terms.strUI + ";";
      }
      if (element == "4") {
        _roles += this.terms.strUX + ";";
      }
      if (element == "6") {
        _roles += this.terms.strPM + ";";
      }
      if (element == "7") {
        _roles += this.terms.strINVESTORS + ";";
      }

      if (element == "8") {
        _roles += otherrole + ";";
      }
    })
    return _roles;
  }


  displayPurpose(purposes, otherpurpose) {

    if (!purposes) {
      return "";
    }
    if (purposes.length == 0) {
      return "";
    }
    let _purposes = "";

    purposes.forEach(element => {
      if (element == "1") {
        _purposes += this.terms.strEVENT_PURPOSE_1 + ";";
      }
      if (element == "2") {
        _purposes += this.terms.strEVENT_PURPOSE_2 + ";";
      }
      if (element == "3") {
        _purposes += this.terms.strEVENT_PURPOSE_3 + ";";
      }
      if (element == "4") {
        _purposes += this.terms.strEVENT_PURPOSE_4 + ";";
      }
      if (element == "5") {
        _purposes += this.terms.strEVENT_PURPOSE_5 + ";";
      }
      if (element == "6") {
        _purposes += this.terms.strEVENT_PURPOSE_6 + ";";
      }
      if (element == "7") {
        _purposes += this.terms.strEVENT_PURPOSE_7 + ";";
      }
      if (element == "8") {
        _purposes += otherpurpose + ";";
      }
    })
    return _purposes;
  }

  urlify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }

  onRolesChange(event) {

    if (!this.filterCondition.isProFounder &&
      !this.filterCondition.isDeveloper &&
      !this.filterCondition.isUI &&
      !this.filterCondition.isUX &&
      !this.filterCondition.isPM &&
      !this.filterCondition.isInvestors &&
      !this.filterCondition.isRoleOthers) {
      this.displayUsers = this.users;
      this.foundItemNum = -1;
    } else {
      let currentItem = []
      this.users.map(item => {

        if (!this.utilitySrv.IsNullOrEmpty(item.roles)) {
          if (this.filterCondition.isProFounder
            && item.roles.indexOf('1') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isDeveloper
            && item.roles.indexOf('2') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isUI
            && item.roles.indexOf('3') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isUX
            && item.roles.indexOf('4') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isPM
            && item.roles.indexOf('6') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isInvestors
            && item.roles.indexOf('7') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isRoleOthers
            && item.roles.indexOf('8') > -1) {
            currentItem.push(item);
          }
        }

        this.displayUsers = currentItem;

      })
      if (this.displayUsers.length == 0 || this.displayUsers.length == this.users.length) {
        this.foundItemNum = -1;
      } else {
        this.foundItemNum = this.displayUsers.length;
      }
    }
  }


  isExist(items, id) {
    let isExist = items.filter(item => item.id == id);
    if (isExist.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  onPurposeChange(event) {
    if (!this.filterCondition.isEvent_purpose_1 &&
      !this.filterCondition.isEvent_purpose_2 &&
      !this.filterCondition.isEvent_purpose_3 &&
      !this.filterCondition.isEvent_purpose_4 &&
      !this.filterCondition.isEvent_purpose_5 &&
      !this.filterCondition.isEvent_purpose_6 &&
      !this.filterCondition.isEvent_purpose_7 &&
      !this.filterCondition.isEvent_purpose_8
    ) {
      this.displayUsers = this.users;
      this.foundItemNum = -1;
    } else {
      let currentItem = []
      this.users.map(item => {

        if (!this.utilitySrv.IsNullOrEmpty(item.purposes)) {
          if (this.filterCondition.isEvent_purpose_1
            && item.purposes.indexOf('1') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_2
            && item.purposes.indexOf('2') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_3
            && item.purposes.indexOf('3') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_4
            && item.purposes.indexOf('4') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_5
            && item.purposes.indexOf('5') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_6
            && item.purposes.indexOf('6') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_7
            && item.purposes.indexOf('7') > -1) {
            currentItem.push(item);
          }
          if (this.filterCondition.isEvent_purpose_8
            && item.purposes.indexOf('8') > -1) {
            currentItem.push(item);
          }
        }


        this.displayUsers = currentItem;


      })
      if (this.displayUsers.length == 0 || this.displayUsers.length == this.users.length) {
        this.foundItemNum = -1;
      } else {
        this.foundItemNum = this.displayUsers.length;
      }


    }

  }

  selectedAttendee(item) {
    this.selectedItem = item;
  }
}
