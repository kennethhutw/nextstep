import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  DialogService,
  RecruitService,
  AppSettingsService,
  ToastService,

} from '../../../_services';
import {
  Utility
} from '../../../_helpers';
import {
  AuthStore
} from "../../../_services/auth.store";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-myproject-recruit',
  templateUrl: './myproject-recruit.component.html',
  styleUrls: ['./myproject-recruit.component.scss']
})
export class MyProjectRecruitComponent implements OnInit {
  projectId = "";
  currentProject;
  invitationForm: FormGroup;
  isViewMode = false;
  submitted = false;
  currentUser;
  projectMsg = "";
  currentTab = "current";
  invitedTab = "userId";

  isChat: boolean = false;
  current = [];
  drafts = [];
  closed = [];
  items = [];
  recruitForm: FormGroup;
  skillOptions = [];

  status: string = "null";

  selectedItem: any[] = [];

  canMove: boolean = false;


  @ViewChild('selectCountry') selectCountry: ElementRef;
  @ViewChild('close_recruit_button') close_recruit_button: ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private recruitSrv: RecruitService,
    private dialogSrv: DialogService,
    private toastSrv: ToastService,
    public utilitySrv: Utility,
    private appSettingsSrv: AppSettingsService,
    private authStoreSrv: AuthStore) {
    this.skillOptions = this.appSettingsSrv.skillOptions();
    this.invitationForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.projectId = this.route.snapshot.paramMap.get("projectId");

    this.refreshRecruitList();

    this.recruitForm = this.formBuilder.group({
      id: [""],
      position: ["", Validators.required],
      scopes: ["", Validators.required],
      skills: [""],
      work12: [false],
      work34: [false],
      work56: [false],
      work78: [false],
      work9: [false],
    });

  }

  changeTab(tab) {
    this.currentTab = tab;
    this.selectedItem = [];
    this.canMove = false;
    if (this.current.length > 0) {
      this.current.forEach(element => {
        element.isSelected = false
      });
    }
    if (this.drafts.length > 0) {
      this.drafts.forEach(element => {
        element.isSelected = false
      });
    }
    if (this.closed.length > 0) {
      this.closed.forEach(element => {
        element.isSelected = false
      });
    }

  }

  changeInvitedTab(tab) {
    this.invitedTab = tab;
  }

  inValid() {
    return this.recruitForm.invalid;
  }
  get f() {
    return this.recruitForm.controls;
  }

  onDisplayOptions(event: any) {
    this.selectCountry.nativeElement.classList.toggle('expanded');
  }

  onSelectItem(event, id) {
    if (event.target.checked) {
      if (this.selectedItem.indexOf(id) == -1) {
        this.selectedItem.push(id)
      }
    } else if (!event.target.checked) {
      if (this.selectedItem.indexOf(id) > -1) {
        this.selectedItem.forEach((element, index) => {
          if (element == id) this.selectedItem.splice(index, 1);
        });
      }
    }

    if (this.selectedItem.length > 0) {
      this.canMove = true;
    } else {
      this.canMove = false;
    }
  }

  refreshRecruitList() {
    this.recruitSrv.getByProjectId(this.projectId).then(res => {
      console.log("recruitSrv =======", res)
      if (res['result'] === 'successful') {
        let data = res['data'];
        data.forEach((item) => {
          item['isSelected'] = false;
          if (!this.utilitySrv.IsNullOrEmpty(item['skills'].toString())) {
            item['skills'] = item['skills'].toString().split(',');
          }
        });
        this.items = data;
        if (data.length > 0) {
          this.current = data.filter((application) => {
            return application.status == '1'
          });
          this.drafts = data.filter((application) => {
            return application.status == '0'
          });
          this.closed = data.filter((application) => {
            return application.status == '2'
          });

        }

      }
    })
  }


  onStatusChange(event) {
    let _status = event.target.value
    debugger;
    this.selectedItem.forEach((element, index) => {
      let status = "1";
      switch (_status) {
        case "drafts":
          status = "0";
          break;
        case "closed":
          status = "2";
          break;
      }
      let params = {
        id: element,
        available: null,
        uid: this.currentUser.id,
        status: status
      }

      this.recruitSrv.updateStatus(params).then(res => {
        this.status = null;
        this.refreshRecruitList();
      })
    })


  }

  onAvailableChange(event, item) {
    let params = {
      id: item.id,
      available: event.value,
      uid: this.currentUser.id,
      status: item.status
    }

    let _available = event.value;
    this.recruitSrv.updateStatus(params).then(res => {

      if (res['result'] == 'successful') {
        let _index = this.current.findIndex((obj => obj.id == item.id));
        this.current[_index].available = _available;
      }
    })
  }

  onClickView(item) {

    let _skills = [];
    if (!this.utilitySrv.IsNullOrEmpty(item.skills)) {
      // let _skill_values = this.userProfile.skills.split(",");

      this.skillOptions.map(option => {
        if (item.skills.includes(option.value)) {
          _skills.push(option.text);
        }
      })
    }
    this.recruitForm.setValue({
      id: item.id,
      position: item.position,
      scopes: item.scopes,
      skills: _skills,
      work12: item.work12,
      work34: item.work34,
      work56: item.work56,
      work78: item.work78,
      work9: item.work9,
    });
  }

  onRecruitSubmit() {
    // todo
  }

  onUpdateRecruitSubmit() {
    this.submitted = true;
    if (this.recruitForm.invalid) {
      return;
    }
    const values = this.recruitForm.value;
    let _skills = "";
    let _skills_array = [];
    if (values.skills) {
      values.skills.map(skill => {
        let _skill_text = skill;
        if (typeof skill == "object") {
          _skill_text = skill.text;
        }
        let _index = this.skillOptions.findIndex((obj => obj.text == _skill_text));
        if (_index) {
          _skills += this.skillOptions[_index].value + ",";
          _skills_array.push(this.skillOptions[_index].value);
        }
      })

      if (_skills.length > 0) {
        _skills = _skills.substring(0, _skills.length - 1);
      }
    }
    let params = {
      position: values.position,
      scopes: values.scopes,
      projectId: this.projectId,
      status: "0",
      skills: _skills,
      work12: values.work12 ? values.work12 : "0",
      work34: values.work34 ? values.work34 : "0",
      work56: values.work56 ? values.work56 : "0",
      work78: values.work78 ? values.work78 : "0",
      work9: values.work9 ? values.work9 : "0",
      uid: this.currentUser.id,
      startDate: moment.utc().valueOf(),
      endDate: moment.utc().valueOf()
    }

    this.recruitSrv.update(values.id, params).then(res => {

      if (res["result"] === "successful") {
        this.recruitForm.reset();
        this.close_recruit_button.nativeElement.click();
        this.toastSrv.showToast('Success',
          " " + values.position + "已更新.",
          this.toastSrv.iconClasses.success);
        this.refreshRecruitList();
      }
    }).catch(error => {
      this.toastSrv.showToast('Failed',
        error.message,
        this.toastSrv.iconClasses.error);
    })
  }

  onDeleteJobItem(item) {
    this.dialogSrv.deleteThis('確定刪除此' + item.position, `確定刪除此${item.position}?,此動作將無法復原`, () => {
      this.recruitSrv.delete(item.id, this.currentUser.id).then(res => {
        if (res['result'] == "successful") {

          this.items = this.items.filter(obj => {
            return obj.id !== item.id
          })

          this.current = this.items.filter((application) => {
            return application.status == '1'
          });
          this.drafts = this.items.filter((application) => {
            return application.status == '0'
          });
          this.closed = this.items.filter((application) => {
            return application.status == '2'
          });


          this.toastSrv.showToast('Success',
            " " + item.position + "已刪除.",
            this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed',
            res['message'],
            this.toastSrv.iconClasses.error);
        }
      }).catch(error => {
        console.error("Delete failed! " + error.message);
        this.toastSrv.showToast('Failed',
          error.message,
          this.toastSrv.iconClasses.error);
      })
    }, () => { })

  }

  convertTag(term) {
    let _index = this.skillOptions.findIndex((obj => obj.value == term.toLowerCase()));
    if (_index > 0) {
      return this.skillOptions[_index].text;
    }
  }

  onCreateRecruit() {
    this.isViewMode = false;
    this.recruitForm.reset();
  }

}
