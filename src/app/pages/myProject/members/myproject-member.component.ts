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
  selector: 'app-myproject-member',
  templateUrl: './myproject-member.component.html',
  styleUrls: ['./myproject-member.component.css']
})
export class MyProjectMemberComponent implements OnInit {
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
  candidates = [];
  interviews = [];
  rejected = [];
  invitingList = [];
  past = [];
  invitedEmail = "";
  invitedUserId = "";
  usersDisplayList;
  usersList;
  reciver = null;

  status: string = "null";

  selectedItem: any[] = [];

  canMoveMember: boolean = false;


  @ViewChild('selectCountry') selectCountry: ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
    this.projectSrv.getProject(this.projectId, this.currentUser.id).then(res => {
      if (res['result'] === 'successful') {
        this.currentProject = res['data'];

      }
    })
    this.projectSrv.getMembers(
      this.projectId
    ).then(res => {

      if (res['result'] == 'successful') {
        let data = res['data'];

        data.forEach((item) => {
          item['isSelected'] = false;
        });
        console.log("init data =======", data)
        //  isSelected

        if (data.length > 0) {
          this.current = data.filter((member) => {
            return member.status == 'current'
          });
          this.candidates = data.filter((member) => {
            return member.status == 'candidate'
          });
          this.interviews = data.filter((member) => {
            return member.status == 'interview'
          });
          this.rejected = data.filter((member) => {
            return member.status == 'rejected'
          });
          this.past = data.filter((member) => {
            return member.status == 'past'
          });

        }
      }
    })

    this.invitationSrv.getInvitingList(this.projectId).then(res => {
      if (res['result'] == 'successful') {
        let _invitingList = res['data'];
        this.invitingList = _invitingList.filter((member) => {
          return member.status == '0'
        });
      }
    })

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
    if (this.candidates.length > 0) {
      this.candidates.forEach(element => {
        element.isSelected = false
      });
    }
    if (this.interviews.length > 0) {
      this.interviews.forEach(element => {
        element.isSelected = false
      });
    }
    if (this.rejected.length > 0) {
      this.rejected.forEach(element => {
        element.isSelected = false
      });
    }
    if (this.invitingList.length > 0) {
      this.invitingList.forEach(element => {
        element.isSelected = false
      });
    }
    if (this.past.length > 0) {
      this.past.forEach(element => {
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
  inviteByEmail() {
    this.submitted = true;
    const value = this.invitationForm.value;
    // stop here if form is invalid
    if (this.invitationForm.invalid) {
      return;
    }
    // projectId,
    //   userid,
    //   email,
    //   name,
    //   status,
    //   uid
    let domain = window.location.origin;
    let _projectLink = domain + "/project/" + this.projectId;
    let _invitationLink = domain + "/invitedSignup?projectId=" + this.projectId +
      "&email=" + value.email + "&name=" + value.name;


    this.invitationSrv.insert({
      projectId: this.projectId,
      userid: "",
      name: value.name,
      email: value.email,
      status: "0",
      uid: this.currentUser.id,
      projectName: this.currentProject.name,
      sender: this.currentUser.name,
      projectLink: _projectLink,
      invitationLink: _invitationLink
    }).then(res => {

      if (res['result'] === 'successful') {
        this.submitted = false;
        this.invitationForm.reset();
        this.invitedUserId = "";
        document.getElementById('close_invited').click();
      } else {
        this.projectMsg = res['error'].message;
      }

    }, (error) => {
      console.error("saveError", error);
      this.projectMsg = error.message;
    })
  }
  onDisplayOptions(event: any) {
    this.selectCountry.nativeElement.classList.toggle('expanded');
  }
  onCountryChange(value) {
    this.usersDisplayList = this.usersList.filter(option => option.uid.toLowerCase().startsWith(value.toLowerCase()))
  }

  onClickResend(invitation) {

    this.confirmDialogService.confirmThis('確定要再次邀請嗎？', () => {
      // Yes clicked
      let domain = window.location.origin;
      let _projectLink = domain + "/project/" + this.projectId;
      let _invitationLink = domain + "/invitedSignup?projectId=" + this.projectId +
        "&email=" + invitation.email + "&name=" + invitation.name + "&id=" + invitation.id;

      this.invitationSrv.resend({
        invitationId: invitation.id,
        projectId: this.projectId,
        userid: "",
        name: invitation.name,
        email: invitation.email,
        status: "0",
        uid: this.currentUser.id,
        projectName: this.currentProject.name,
        sender: this.currentUser.name,
        projectLink: _projectLink,
        invitationLink: _invitationLink
      }).then(res => {
        if (res['result'] === 'successful') {
          this.toastr.showToast('email', 'successfully', 'success');
          for (var i = 0; i < this.invitingList.length; i++) {
            if (this.invitingList[i].id == invitation.id) {
              this.invitingList[i].invitedate = res['data'];
            }
          }
        } else {
          this.toastr.showToast('email', 'Failed', 'error');
        }

      }).catch(error => {
        console.log("invite failed", error);
        this.toastr.showToast('email', 'Failed', 'error');
      })

    }, () => {
      // No clicked
    });

  }

  onClickDelete(id) {
    this.confirmDialogService.confirmThis('確定要刪除？', () => {
      this.invitationSrv.delete(id).then(res => {
        if (res['result'] === 'successful') {
          this.invitingList = this.invitingList.filter(option => option.id != id);


          this.toastr.showToast('成員', '刪除成功', 'success');
        } else {
          this.toastr.showToast('成員', '刪除失敗', 'error');
        }

      }).catch(error => {
        console.log("delete failed", error);
        this.toastr.showToast('成員', '刪除失敗', 'error');
      })
    }, () => {
      // No clicked
    });
  }

  onChat(reciver) {

    this.isChat = !this.isChat;
    if (!this.isChat) {
      this.reciver = null;
    } else {
      this.reciver = reciver;
    }
  }

  onStatusChange(event) {
    let displayStatus = "目前成員";
    let _changeto = event.target.value;
    switch (event.target.value) {
      case "inviting":
        displayStatus = "邀請中";
        break;
      case "interview":
        displayStatus = "面談中";
        break;
      case "rejected":
        displayStatus = "已拒絕";
        break;
      case "history":
        displayStatus = "歷程成員";
        break;
    }
    this.confirmDialogService.confirmThis('確定要移動至' + displayStatus, () => {
      // Yes clicked

      this.projectSrv.updateMemberstatus(this.currentProject.id, this.selectedItem.toString(), _changeto, this.currentUser.id).then(res => {
        console.log("updateMemberstatus", res);
        if (res["result"] == 'successful') {
          this.refreshMemberList();
          this.toastr.showToast('成員', '移動至' + displayStatus + '成功', 'success');
        } else {
          this.toastr.showToast('成員', '移動至' + displayStatus + '失敗', 'error');
        }
      }).catch(error => {
        console.log("update failed", error);
        this.toastr.showToast('成員', '移動至' + displayStatus + '失敗', 'error');
      })

    }, () => {
      // No clicked
      this.status = null;
    });
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

  refreshMemberList() {
    this.projectSrv.getMembers(
      this.projectId
    ).then(res => {

      if (res['result'] == 'successful') {
        let data = res['data'];

        data.forEach((item) => {
          item['isSelected'] = false;
        });

        //  isSelected

        if (data.length > 0) {
          this.current = data.filter((member) => {
            return member.status == 'current'
          });
          this.candidates = data.filter((member) => {
            return member.status == 'candidate'
          });
          this.interviews = data.filter((member) => {
            return member.status == 'interview'
          });
          this.rejected = data.filter((member) => {
            return member.status == 'rejected'
          });
          this.past = data.filter((member) => {
            return member.status == 'past'
          });

        }
      }
    })
  }
  onToggleChat(event) {
    this.isChat = !this.isChat;
  }
}
