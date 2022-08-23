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
  InvitationService,
  ToastService
} from '../../../_services';
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


  status: string = "null";

  selectedItem: any[] = [];

  canMoveMember: boolean = false;


  @ViewChild('selectCountry') selectCountry: ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private recruitSrv: RecruitService,
    private dialogSrv: DialogService,
    private toastr: ToastService,
    private projectSrv: ProjectService,
    private confirmDialogService: DialogService,
    private invitationSrv: InvitationService,
    private authStoreSrv: AuthStore) {

    this.invitationForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.projectId = this.route.snapshot.paramMap.get("projectId");

    this.refreshRecruitList();

  }

  changeTab(tab) {
    this.currentTab = tab;
    this.selectedItem = [];
    this.canMoveMember = false;
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
    return this.invitationForm.invalid;
  }
  get f() {
    return this.invitationForm.controls;
  }

  inviteByUserId() {
    this.submitted = true;

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
      this.canMoveMember = true;
    } else {
      this.canMoveMember = false;
    }
  }

  refreshRecruitList() {
    this.recruitSrv.getByProjectId(this.projectId).then(res => {
      console.log("getByProjectId=============", res)
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
}
