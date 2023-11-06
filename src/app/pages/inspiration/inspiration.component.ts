import {
  ViewEncapsulation,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  CommentsService,
  ToastService,
  DataService,
  InspirationService
} from 'src/app/_services';
import { TranslateService } from "@ngx-translate/core";
import {
  AuthStore
} from "src/app/_services/auth.store";
import {
  Utility,
  TimeUtility
} from 'src/app/_helpers';
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { environment } from "../../../environments/environment";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-inspiration',
  templateUrl: './inspiration.component.html',
  styleUrls: ['./inspiration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InspirationComponent implements OnInit {
  status: string = "";
  currentUser: any;

  inspirationForm: FormGroup;
  link: string = "";

  currentTab: string = "stories";
  displayItems: any[] = [];
  allitems: any[] = [];
  stories: any[] = [];
  ideas: any[] = [];
  experience: any[] = [];
  templates: any[] = [];

  editedItem = null;

  commentContent: string = "";

  searchText: string = "";

  replyComment: string = "";
  hideall = {};
  loading = true;

  strImprovement: string = "";
  strBug: string = "";
  strHelp: string = "";

  @ViewChild('closeExpbutton') closeExpbutton;


  constructor(
    private formBuilder: FormBuilder,
    private toastSrv: ToastService,
    private utilitySrv: Utility,
    private authStoreSrv: AuthStore,
    private inspirationSrv: InspirationService,
    private CommentsSrv: CommentsService,
    private dataSrv: DataService,
    private timeUtilitySrv: TimeUtility,
    private translateSrv: TranslateService,
    private spinnerSrv: NgxSpinnerService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utilitySrv.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.init_terms();
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utilitySrv.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.init_terms();
      }
    });
  }

  init_terms() {
    this.translateSrv.get("IMPROVEMENT").subscribe((text: string) => {
      this.strImprovement = text;
    });
    this.translateSrv.get("BUG").subscribe((text: string) => {
      this.strBug = text;
    });
    this.translateSrv.get("HELP").subscribe((text: string) => {
      this.strHelp = text;
    });
  }

  ngOnInit() {

    this.spinnerSrv.show();
    this.currentUser = this.authStoreSrv.getUserData();
    this.refresh_list();

    this.inspirationForm = this.formBuilder.group({
      title: [""],
      content: ["", Validators.required],
      metadata: [""],
      category: ["stories", Validators.required],
      type: ["content", Validators.required],
    });

  }

  refresh_list() {
    this.inspirationSrv.getall().subscribe(res => {

      if (res["result"] == "successful") {

        this.allitems = res["data"];

        if (this.allitems) {

          this.stories = this.allitems.filter(item => {
            return item.category == "stories"
          })

          this.ideas = this.allitems.filter(item => {
            return item.category == "ideas"
          })

          this.experience = this.allitems.filter(item => {
            return item.category == "experience"
          })

          this.templates = this.allitems.filter(item => {
            return item.category == "templates"
          })


          this.displayItems = this.stories;
        }

      }

      this.spinnerSrv.hide();
      this.loading = false
    })

  }

  get f() {
    return this.inspirationForm.controls;
  }

  inValid() {
    return this.inspirationForm.invalid;
  }


  onCategoryChange(event) {

    this.inspirationForm.get("category").setValue(event.target.value);
  }

  onTypeChange(event) {

    this.inspirationForm.get("type").setValue(event.target.value);
  }

  onLinkEnter(event) {
    this.link = event.target.value;
  }

  onMetaData(event) {
    this.inspirationForm.get("metadata").setValue(event);
  }

  onSubmit() {
    const values = this.inspirationForm.value;
    // stop here if form is invalid
    if (this.inspirationForm.invalid) {
      return;
    }

    this.inspirationSrv.insert(values.title,
      values.content,
      values.category,
      values.type,
      values.metadata,
      "",
      this.currentUser.id).subscribe(res => {
        if (res['result'] == "successful") {
          let _new_item = {
            available: "1",
            title: values.title,
            content: values.category,
            type: values.type,
            metadata: values.metadata,
            createdAt: this.timeUtilitySrv.getCurrentUnixTimeString(),
            createdBy: this.currentUser.id,
            id: res["data"],
          }

          this.allitems.push(_new_item);

          this.stories = this.allitems.filter(item => {
            return item.category == "stories"
          })

          this.ideas = this.allitems.filter(item => {
            return item.category == "ideas"
          })

          this.experience = this.allitems.filter(item => {
            return item.category == "experience"
          })

          this.templates = this.allitems.filter(item => {
            return item.category == "templates"
          })

          if (this.currentTab === "stories") {
            this.displayItems = this.stories;
          } else if (this.currentTab === "ideas") {
            this.displayItems = this.ideas;
          } else if (this.currentTab === "experience") {
            this.displayItems = this.experience;
          } else if (this.currentTab === "templates") {
            this.displayItems = this.templates;
          }


          this.inspirationForm.reset();
          document.getElementById("close_new_proposl").click();

          this.toastSrv.showToast("",
            "successfully",
            this.toastSrv.iconClasses.success);
        }
      }, (error) => {
        console.log("error", error);
        this.toastSrv.showToast("",
          error.message,
          this.toastSrv.iconClasses.error);
      })

  }


  onClickDelete(item) {
    this.editedItem = item;
  }

  onDeleteSubmit() {

    this.inspirationSrv.delete(this.editedItem.id, this.currentUser.id).then(res => {

      if (res['result'] == "successful") {

        this.allitems = this.allitems.filter(obj => {
          return obj.id !== this.editedItem.id
        })

        this.displayItems = this.allitems;
        this.editedItem = null;
        this.toastSrv.showToast('',
          "delete successful",
          this.toastSrv.iconClasses.success);
      } else {
        this.toastSrv.showToast('',
          "delete failed ",
          this.toastSrv.iconClasses.error);
      }
      this.closeExpbutton.nativeElement.click();
    }, (error) => {
      console.log("error", error);
      this.toastSrv.showToast('',
        "delete failed ",
        this.toastSrv.iconClasses.error);
      this.closeExpbutton.nativeElement.click();
    })

  }



  changeTab(tab) {
    this.currentTab = tab;
    if (tab === "stories") {
      this.displayItems = this.stories;
    } else if (tab === "ideas") {
      this.displayItems = this.ideas;
    } else if (tab === "experience") {
      this.displayItems = this.experience;
    } else if (tab === "templates") {
      this.displayItems = this.templates;
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



  onVote(event, action, proposialId) {
    try {
      this.inspirationSrv.vote(action,
        this.currentUser.id,
        proposialId).then(res => {
          let _index = this.displayItems.findIndex((obj => obj.id == proposialId));
          if (_index > -1) {


            if (action === "likes") {
              this.displayItems[_index].like_count += 1

            } else {
              this.displayItems[_index].dislike_count += 1

            }

            if (this.currentTab === "stories") {
              this.stories = this.displayItems;
            } else if (this.currentTab === "ideas") {
              this.ideas = this.displayItems;
            } else if (this.currentTab === "experience") {
              this.experience = this.displayItems;
            } else if (this.currentTab === "templates") {
              this.templates = this.displayItems;
            }

            // this.processed = this.allitems.filter(item => {
            //   return item.process_status == "processed"
            // })
            // if (this.currentUser) {
            //   this.myproposals = this.allitems.filter(item => {
            //     return item.createdBy == this.currentUser.id
            //   })
            // }
            // this.refreshDisplayItems()

          }
        }).catch(error => {
          console.error("error", error)
        })


    } catch (error) {
      console.error(error.message)
    }

  }


  onCopy(event, content) {
    try {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = content;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastSrv.showToast('', 'copied', 'success');
    } catch (error) {
      console.log("error", error);
      this.toastSrv.showToast('', 'Failed to copy', 'error');
    }
  }
}
