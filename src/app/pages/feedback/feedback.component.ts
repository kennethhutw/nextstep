import {
  HostListener,
  ViewEncapsulation,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ProposalService,
  CommentsService,
  DialogService,
  ToastService
} from 'src/app/_services';
import {
  AuthStore
} from "src/app/_services/auth.store";
import {
  Utility,
  TimeUtility
} from 'src/app/_helpers';
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent implements OnInit {
  status: string = "";
  propsoalContent: string = "";
  proposaltype: string = "";
  currentUser: any;

  currentTab: string = "all";
  displayItems: any[] = [];
  allitems: any[] = [];
  processed: any[] = [];
  myproposals: any[] = [];
  editedItem = null;
  editedProposal = null;
  commentContent: string = "";

  searchText: string = "";

  replyComment: string = "";
  hideall = {};
  hideprocessed = {};
  hidemyproposals = {}

  @ViewChild('closeExpbutton') closeExpbutton;


  constructor(
    private toastSrv: ToastService,
    private utilitySrv: Utility,
    private authStoreSrv: AuthStore,
    private proposalSrv: ProposalService,
    private CommentsSrv: CommentsService,
    private dialogSrv: DialogService,
    private timeUtilitySrv: TimeUtility
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.proposalSrv.getall().subscribe(res => {
      if (res["result"] == "successful") {

        this.allitems = res["data"];
        this.allitems.forEach(element => {

          if (!this.utilitySrv.IsNullOrEmpty(element.imageUrl)) {
            element.imageUrl = environment.assetUrl + element.imageUrl;
          }
        });
        this.displayItems = this.allitems;
        // process_status
        this.processed = this.allitems.filter(item => {
          return item.process_status == "processed"
        })
        if (this.currentUser) {
          this.myproposals = this.allitems.filter(item => {
            return item.createdBy == this.currentUser.id
          })
        }
        this.processed.forEach(e => {
          this.hideprocessed[e.id] = false;
        });
        this.myproposals.forEach(e => {
          this.hidemyproposals[e.id] = false;
        });
        this.allitems.forEach(e => {
          this.hideall[e.id] = false;
        });
      }
    })

  }

  onSortChange(event) {
    if (this.currentTab === "processed") {
      this.displayItems = this.processed;
    } else if (this.currentTab === "myproposal") {
      this.displayItems = this.myproposals;
    } else {
      this.displayItems = this.allitems;
    }

    if (event.target.value === "") {
      this.displayItems.sort((a, b) => a.createdAt - b.createdAt);
    } else if (event.target.value === "old") {
      this.displayItems.sort((a, b) => b.createdAt - a.createdAt);
    } else if (event.target.value === "height") {
      this.displayItems.sort((a, b) => a.like_count - b.like_count);

    }

  }

  onSortTypeChange(event) {
    if (this.currentTab === "processed") {
      this.displayItems = this.processed;
    } else if (this.currentTab === "myproposal") {
      this.displayItems = this.myproposals;
    } else {
      this.displayItems = this.allitems;
    }


    if (!this.utilitySrv.IsNullOrEmpty(event.target.value)) {
      this.displayItems = this.displayItems.filter((item) => {
        return item.category == event.target.value
      });
    }
  }
  onTypeChange(event) {
    this.proposaltype = event.target.value;
  }

  onSubmit() {

    if (!this.utilitySrv.IsNullOrEmpty(this.propsoalContent)
      && !this.utilitySrv.IsNullOrEmpty(this.proposaltype)
      && this.currentUser) {
      this.proposalSrv.insert(this.proposaltype, this.propsoalContent, this.proposaltype, this.currentUser.id).subscribe(res => {
        if (res['result'] == "successful") {
          let _new_item = {
            available: "1",
            category: this.proposaltype,
            comment_count: "0",
            comments: [],
            createdAt: this.timeUtilitySrv.getCurrentUnixTimeString(),
            createdBy: this.currentUser.id,
            dislike_count: "0",
            email: this.currentUser.email,
            id: res["data"],
            imageUrl: environment.assetUrl + this.currentUser.imageUrl,
            name: this.currentUser.name,
            title: this.proposaltype,
            detail: this.propsoalContent,
          }

          this.allitems.push(_new_item);
          this.myproposals.push(_new_item);
          this.propsoalContent = "";
          this.proposaltype = "";
          document.getElementById("close_new_proposl").click();
        }
      }, (error) => {
        console.log("error", error);
      })
    }
  }


  onClickDelete(item) {
    this.editedItem = item;
  }

  onDeleteSubmit() {

    this.proposalSrv.delete(this.editedItem.id, this.currentUser.id).then(res => {

      if (res['result'] == "successful") {
        this.myproposals = this.myproposals.filter(obj => {
          return obj.id !== this.editedItem.id
        })

        this.allitems = this.allitems.filter(obj => {
          return obj.id !== this.editedItem.id
        })

        this.displayItems = this.allitems;
        this.editedItem = null;
        this.toastSrv.showToast('意見回饋',
          "刪除成功 ",
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('意見回饋',
          "刪除失敗 ",
          this.toastSrv.iconClasses.error);
      }
      this.closeExpbutton.nativeElement.click();
    }, (error) => {
      console.log("error", error);
      this.toastSrv.showToast('意見回饋',
        "刪除失敗 ",
        this.toastSrv.iconClasses.error);
      this.closeExpbutton.nativeElement.click();
    })

  }

  onModified(item) {
    this.editedProposal = item;
    this.proposaltype = item.category;
    this.propsoalContent = item.detail;
  }

  onModifiedSubmit() {

    this.proposalSrv.update(this.editedProposal.id,
      this.proposaltype,
      this.propsoalContent,
      this.proposaltype, this.currentUser.id).subscribe(res => {
        if (res['result'] == "successful") {
          let objIndex = this.allitems.findIndex((obj => obj.id == this.editedProposal.id));
          this.allitems[objIndex].detail = this.propsoalContent;
          this.allitems[objIndex].category = this.proposaltype;
          this.propsoalContent = "";
          this.proposaltype = "";
          document.getElementById("close_modify_proposl").click();
          this.editedProposal = null;

          this.myproposals = this.allitems.filter(item => {
            return item.createdBy == this.currentUser.id
          })

        }
      }, (error) => {
        console.log("error", error);
      })
  }

  changeTab(tab) {
    this.currentTab = tab;
    if (tab === "processed") {
      this.displayItems = this.processed;
    } else if (tab === "myproposal") {
      this.displayItems = this.myproposals;
    } else {
      this.displayItems = this.allitems;
    }
  }
  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  new_comment(item) {
    this.editedItem = item;
  }

  show_comment(items, item) {
    items[item.id] = !items[item.id];
  }

  delete_comment(items, item) {

  }

  modify_comment(items, item) {

  }

  onCommentSubmit() {
    if (!this.utilitySrv.IsNullOrEmpty(this.commentContent)

      && this.currentUser) {
      this.CommentsSrv.insertComment(this.currentUser.id,
        this.editedItem.id, this.commentContent).subscribe(res => {
          if (res['result'] == "successful") {
            let objIndex = this.allitems.findIndex((obj => obj.id == this.editedItem.id));

            let _new_comment = {
              content: this.commentContent,
              createdAt: this.timeUtilitySrv.getCurrentUnixTimeString(),
              createdBy: this.currentUser.id,
              id: res['data'],
              imageUrl: environment.assetUrl + this.currentUser.imageUrl,
              userName: this.currentUser.name,
              userId: this.currentUser.id,
              userEmail: this.currentUser.email,
              proposalId: this.editedItem.id,
              updatedAt: this.timeUtilitySrv.getCurrentUnixTimeString(),
              updatedBy: this.currentUser.id,
              rating: "0"
            }

            this.allitems[objIndex].comments.push(_new_comment);
            this.allitems[objIndex].comment_count = this.allitems[objIndex].comments.length;
            this.editedItem = "";
            document.getElementById("close_new_comment").click();

          }
        }, (error) => {
          console.log("error", error);
        })
    }
  }

  onComment(event, feedback) {

    this.CommentsSrv.insertComment(this.currentUser.id,
      feedback.id, event.target.value).subscribe(res => {
        if (res['result'] == "successful") {
          feedback.comments.push(res['data']);
          event.target.value = "";
        }
      }, (error) => {
        console.log("error", error);
      })
  }

  refreshDisplayItems() {
    if (this.currentTab === "processed") {
      this.displayItems = this.processed;
    } else if (this.currentTab === "myproposal") {
      this.displayItems = this.myproposals;
    } else {
      this.displayItems = this.allitems;
    }
  }

  onVote(event, action, proposialId) {
    try {
      this.proposalSrv.vote(action,
        this.currentUser.id,
        proposialId).then(res => {
          let _index = this.allitems.findIndex((obj => obj.id == proposialId));
          if (_index > -1) {
            if (action === "likes") {
              this.allitems[_index].like_count = this.allitems[_index].like_count + 1
              this.displayItems = this.allitems;
            } else {
              this.allitems[_index].dislike_count = this.allitems[_index].dislike_count + 1
              this.displayItems = this.allitems;
            }

            this.processed = this.allitems.filter(item => {
              return item.process_status == "processed"
            })
            if (this.currentUser) {
              this.myproposals = this.allitems.filter(item => {
                return item.createdBy == this.currentUser.id
              })
            }
            this.refreshDisplayItems()

          }
        }).catch(error => {
          console.error("error", error)
        })


    } catch (error) {
      console.error(error.message)
    }

  }
}
