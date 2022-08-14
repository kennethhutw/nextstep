import {
  HostListener,
  ViewEncapsulation,
  Component,
  OnInit
} from '@angular/core';
import {
  ProposalService,
  CommentsService
} from 'src/app/_services';
import {
  AuthStore
} from "src/app/_services/auth.store";
import { Utility } from 'src/app/_helpers';
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
  allitems: any[] = [];
  processed: any[] = [];
  myproposals: any[] = [];
  editedItem = null;
  commentContent: string = "";

  replyComment: string = "";

  constructor(
    private utilitySrv: Utility,
    private authStoreSrv: AuthStore,
    private proposalSrv: ProposalService,
    private CommentsSrv: CommentsService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    this.proposalSrv.getall().subscribe(res => {
      console.log(" proposalSrv ===============", res)
      if (res["result"] == "successful") {
        this.allitems = res["data"];
        // process_status
        this.processed = this.allitems.filter(item => {
          return item.process_status = "processed"
        })
        this.myproposals = this.allitems.filter(item => {
          return item.createdBy = this.currentUser.id
        })

      }
    })
    // if (this.currentUser) {

    // } else {
    //   this.proposalSrv.getall().subscribe(res => {
    //     console.log("init proposal =======", res);
    //     if (res["result"] == "successful") {
    //       this.allitems = res["data"];
    //     }
    //   })
    // }

  }

  onSortChange(event) { }

  onTypeChange(event) {
    this.proposaltype = event.target.value;
  }

  onSubmit() {
    console.log("onSubmit")
    if (!this.utilitySrv.IsNullOrEmpty(this.propsoalContent)
      && !this.utilitySrv.IsNullOrEmpty(this.proposaltype)
      && this.currentUser) {
      this.proposalSrv.insert(this.proposaltype, this.propsoalContent, this.proposaltype, this.currentUser.id).subscribe(res => {
        if (res['result'] == "successful") {
          document.getElementById("close_new_proposl").click();
        }
      }, (error) => {
        console.log("error", error);
      })
    }
  }

  changeTab(tab) {
    this.currentTab = tab;
  }
  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }

  new_comment(item) {
    this.editedItem = item;
  }
  onCommentSubmit() {
    if (!this.utilitySrv.IsNullOrEmpty(this.commentContent)

      && this.currentUser) {
      this.CommentsSrv.insertComment(this.currentUser.id,
        this.editedItem.id, this.commentContent).subscribe(res => {
          if (res['result'] == "successful") {
            let objIndex = this.allitems.findIndex((obj => obj.id == this.editedItem.id));
            this.allitems[objIndex].comments.push(res['data']);
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
}
