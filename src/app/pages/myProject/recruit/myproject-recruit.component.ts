import {
  HostListener,
  HostBinding,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  DialogService,
  RecruitService,
  ProjectService,
  AppSettingsService,
  ToastService,

} from '../../../_services';
import {
  Utility
} from '../../../_helpers';
import {
  AuthStore
} from "../../../_services/auth.store";
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-myproject-recruit',
  templateUrl: './myproject-recruit.component.html',
  styleUrls: ['./myproject-recruit.component.scss']
})
export class MyProjectRecruitComponent implements OnInit {
  projectId = "";
  currentProject;
  invitationForm: FormGroup;
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


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private recruitSrv: RecruitService,
    private dialogSrv: DialogService,
    private toastr: ToastService,
    private utilitySrv: Utility,
    private confirmDialogService: DialogService,
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
      if (res['result'] === 'successful') {
        let data = res['data'];
        data.forEach((item) => {
          item['isSelected'] = false;
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
  onToggleChat(event) {
    this.isChat = !this.isChat;
  }

  onStatusChange(event) {
    let _status = event.target.value
    this.selectedItem.forEach((element, index) => {

      let params = {
        id: element,
        available: null,
        uid: this.currentUser.id,
        status: _status
      }

      this.recruitSrv.updateStatus(params).then(res => {
        console.log("res ==========", res);
      })
    })

    this.refreshRecruitList();
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
}
