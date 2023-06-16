import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  DialogService,
  AppSettingsService,
  ProjectService,
  InvitationService,
  ToastService,
  RecruitService,
  MembersService,
  ActivityService,
  NotificationService
} from '../../../_services';
import {
  AuthStore
} from "../../../_services/auth.store";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Utility } from 'src/app/_helpers';
import { environment } from "../../../../environments/environment";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-myproject-member',
  templateUrl: './myproject-member.component.html',
  styleUrls: ['./myproject-member.component.scss']
})
export class MyProjectMemberComponent implements OnInit {
  projectId = "";
  currentProject;
  currentUser;
  currentUserInProject;
  allMembers: any[] = [];
  invitationForm: FormGroup;
  recruitForm: FormGroup;
  memberInfoForm: FormGroup;
  isViewMode = false;
  submitted = false;
  projectMsg = "";


  isChat: boolean = false;
  selectedItem: any[] = [];
  selectedEditeMember = null;
  // tabs
  currentTab: string = "current";
  invitedTab: string = "userId";
  current = [];
  candidates = [];
  interviews = [];
  rejected = [];
  invitingList = [];
  past = [];


  // invitation
  invitedEmail = "";
  invitedUserId = "";
  usersDisplayList;
  usersList;
  reciver = null;

  // 移動成員去
  status: string = "null";



  canMoveMember: boolean = false;

  skillOptions: any[] = [];
  @ViewChild('selectCountry') selectCountry: ElementRef;
  @ViewChild('close_recruit_button') close_recruit_button: ElementRef;
  @ViewChild('closeInfobutton') close_Info_button: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private membersSrv: MembersService,
    private route: ActivatedRoute,
    private recruitSrv: RecruitService,
    private toastr: ToastService,
    private projectSrv: ProjectService,
    private confirmDialogService: DialogService,
    private appSettingsSrv: AppSettingsService,
    private invitationSrv: InvitationService,
    private utilitySrv: Utility,
    private authStoreSrv: AuthStore,
    private activitySrv: ActivityService,
    private notificationSrv: NotificationService) {
    this.skillOptions = this.appSettingsSrv.skillOptions();
    this.invitationForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required]
    });
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

    this.memberInfoForm = this.formBuilder.group({
      position: ["", Validators.required],
      scopes: ["", Validators.required],
      isAdmin: [false],
      isOwner: [false]
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
    this.refreshMemberList();

    this.invitationSrv.getInvitingList(this.projectId).then(res => {
      if (res['result'] == 'successful') {
        let _invitingList = res['data'];

        if (_invitingList && _invitingList.length > 0) {
          _invitingList.forEach((item) => {
            item['isSelected'] = false;
            if (!this.utilitySrv.IsNullOrEmpty(item.imageUrl)) {
              item.imageUrl = environment.assetUrl + item.imageUrl;
            }
          });
          this.invitingList = _invitingList;
          // this.invitingList = _invitingList.filter((member) => {
          //   return member.status == '0'
          // });
        } else {
          this.invitingList = [];
        }
      }
    })

  }

  isAllowEdit() {
    if (this.currentUserInProject) {
      if (this.currentUserInProject.role == "member") {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
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
    let domain = window.location.origin;
    let _projectLink = domain + "/project/" + this.projectId;
    let _invitationLink = domain + "/joinproject/";
    this.invitationSrv.inviteByUid({
      projectId: this.projectId,
      userid: this.invitedUserId,
      status: "0",
      uid: this.currentUser.id,
      projectName: this.currentProject.name,
      sender: this.currentUser.name,
      projectLink: _projectLink,
      invitationLink: _invitationLink,
      domain
    }).then(res => {
      if (res['result'] === 'successful') {
        this.submitted = false;
        this.invitationForm.reset();
        this.invitedUserId = "";
        document.getElementById('close_invited').click();
        this.toastr.showToast('成員', '邀請' + this.invitedUserId + 'Email已寄出', 'success');
      } else {
        this.projectMsg = res['message'];
        this.toastr.showToast('成員', '邀請' + this.invitedUserId + 'Email寄失敗! '
          + this.projectMsg, 'error');
      }

    }, (error) => {
      this.toastr.showToast('成員', '邀請' + this.invitedUserId + 'Email寄失敗! '
        + this.projectMsg, 'error');
      console.error("saveError", error);
      this.projectMsg = error.message;
    })

  }
  inviteByEmail() {
    this.submitted = true;
    const values = this.invitationForm.value;
    // stop here if form is invalid
    if (this.invitationForm.invalid) {
      return;
    }

    let domain = window.location.origin;
    let _projectLink = domain + "/project/" + this.projectId;
    let _invitedSignup = domain + "/invitedSignup?projectId=" + this.projectId +
      "&email=" + values.email + "&name=" + values.name;
    let _invitationLink = domain + "/joinproject/";


    this.invitationSrv.insert({
      projectId: this.projectId,
      userid: "",
      name: values.name,
      email: values.email,
      status: "0",
      uid: this.currentUser.id,
      projectName: this.currentProject.name,
      sender: this.currentUser.name,
      projectLink: _projectLink,
      invitationLink: _invitationLink,
      invitedSignup: _invitedSignup,
      domain
    }).then(res => {

      if (res['result'] === 'successful') {
        this.submitted = false;
        this.invitationForm.reset();
        this.invitedUserId = "";
        document.getElementById('close_invited').click();
        this.toastr.showToast('成員', '邀請' + values.name + 'Email已寄出', 'success');

      } else {
        this.projectMsg = res['error'].message;
        this.toastr.showToast('成員', '邀請' + values.name + 'Email寄失敗', 'error');
      }

    }, (error) => {
      this.toastr.showToast('成員', '邀請' + values.name + 'Email寄失敗', 'error');
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
        invitationLink: _invitationLink,
        domain
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
    if (event.target.value != "null") {
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

        this.projectSrv.updateMemberstatus(this.currentProject.id,
          this.selectedItem.toString(),
          _changeto,
          this.currentUser.id).then(res => {
            if (res["result"] == 'successful') {

              this.toastr.showToast('成員', '移動至' + displayStatus + '成功', 'success');

              if (_changeto == "current") {
                let _new_join_members = "";
                this.selectedItem.forEach((userId, index) => {
                  this.allMembers.forEach((member, index) => {
                    if (member.userId == userId) {
                      _new_join_members = member.name + ", ";
                      this.notificationSrv.insert(userId,
                        this.currentUser.id,
                        `恭喜你申請加入${this.currentProject.name}專案被接受！`,
                        "1",
                        '0',
                        '0',
                        this.currentUser.id
                      ).then(res => {
                        if (res['result'] === 'successful') {

                        }
                      })
                    }

                  })

                  this.activitySrv.insert(this.currentUser.id,
                    this.currentProject.id,
                    "join",
                    `${_new_join_members} 加入${this.currentProject.name}專案！`
                  ).subscribe(res => {
                    if (res['result'] === 'successful') { }
                  });
                });

                this.notificationSrv.infoProjectMembers(this.currentProject.id,
                  this.currentUser.id,
                  `${_new_join_members} 加入${this.currentProject.name}專案！`,
                  "1",
                  '0',
                  '0',
                  this.currentUser.id
                ).then(res => {
                  if (res['result'] === 'successful') {

                  }
                })
              }

              this.refreshMemberList();
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

        if (data.length > 0) {
          data.forEach((item) => {
            item['isSelected'] = false;
            if (!this.utilitySrv.IsNullOrEmpty(item.imageUrl)) {
              item.imageUrl = environment.assetUrl + item.imageUrl;
            }
          });

          this.allMembers = data;
          let _index = data.findIndex((member) => {
            return member.userId == this.currentUser.id
          });
          this.currentUserInProject = data[_index];


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

  onRecruitSubmit() {
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

    // projectId,
    //   position,
    //   skills,
    //   scopes,
    //   status,
    //   startDate,
    //   endDate, uid
    this.recruitSrv.insert(params).subscribe(res => {

      if (res["result"] === "successful") {
        this.recruitForm.reset();
        this.close_recruit_button.nativeElement.click();
      }
    })

  }

  onCreateRecruit() {
    this.isViewMode = false;
    this.recruitForm.reset();
  }

  onViewAplication(item) {
    this.isViewMode = true;
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

  onRoleChange(event, member) {
    this.projectSrv.updateMemberstatus(this.currentProject.id,
      member.userId,
      event.target.value,
      this.currentUser.id).then(res => {
        if (res["result"] == 'successful') {
          this.refreshMemberList();
          this.toastr.showToast('成員', '切換角色為' + event.target.value + '成功', 'success');

        } else {
          this.toastr.showToast('成員', '切換角色為' + event.target.value + '失敗', 'error');
        }
      }).catch(error => {
        console.log("update failed", error);
        this.toastr.showToast('成員', '移動至' + event.target.value + '失敗', 'error');
      })
  }

  onImgError(event) {
    event.target.src = "assets/images/defaultProjectIcon.png";
  }

  onEditMemberInfo(event, member) {

    this.selectedEditeMember = member;
    this.memberInfoForm.setValue({
      position: member.position,
      scopes: member.scopes,
      isAdmin: member.isAdmin,
      isOwner: member.isOwner

    });

  }
  onCancelInfo() {
    this.selectedEditeMember = null;
  }

  onMemberInfoSubmit() {
    const values = this.memberInfoForm.value;
    // stop here if form is invalid
    if (this.memberInfoForm.invalid) {
      return;
    }

    let _params = {
      position: values.position,
      uid: this.currentUser.id,
      scopes: values.scopes,
    }

    this.membersSrv.update(this.selectedEditeMember.id, _params).then(res => {
      if (res["result"] == 'successful') {
        this.memberInfoForm.reset();
        this.selectedEditeMember = null;
        this.close_Info_button.nativeElement.click();
        this.refreshMemberList();
        this.toastr.showToast('成員', '更新成功', 'success');
      } else {
        this.toastr.showToast('成員', '更新失敗', 'error');
      }
    }).catch(error => {
      console.log("update failed", error);
      this.toastr.showToast('成員', '更新失敗', 'error');
    })
  }

  onDeleteMemberSubmit(event, member) {
    this.selectedEditeMember = member;
    this.confirmDialogService.confirmThis("確認要刪除此成員", () => {
      this.membersSrv.delete(member.id, this.currentUser.id).then(res => {

        if (res['result'] == "successful") {
          this.selectedEditeMember = null;
          this.refreshMemberList();
          this.toastr.showToast('成員', `${member.name} 已經被刪除`, 'success');


          this.activitySrv.insert(this.currentUser.id,
            this.currentProject.id,
            "leave",
            `${member.name} 離開 ${this.currentProject.name}專案！`
          ).subscribe(res => {
            if (res['result'] === 'successful') { }
          });

          this.notificationSrv.infoProjectMembers(this.currentProject.id,
            this.currentUser.id,
            `${member.name}  離開  ${this.currentProject.name}專案！`,
            "1",
            '0',
            '0',
            this.currentUser.id
          ).then(res => {
            if (res['result'] === 'successful') {

            }
          })

        } else {
          this.toastr.showToast('成員', `${member.name} 刪除失敗`, 'error');
        }
      }, (error) => {
        this.toastr.showToast('成員', `${member.name} 刪除失敗`, 'error');
        console.log("error", error);
      })
    }, () => {

    })
  }

}
