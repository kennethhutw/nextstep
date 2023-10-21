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

  templates = [
    {
      "type": "template",
      "sub_type": "application",
      "title": "The Mutual Relationship Pitch",
      "content": `Subject Line: Mutual Relationship Marketing Collaboration Project

Hi [name],

      I’m [name] from[company name].I’ve followed your blog since 2016.

Your recent posts[write one or a few topics] resonate with me, and I thought it was something our company's audience would appreciate, and I shared it with our email subscribers and on all our social media platforms.

I want to discuss[topic] and see if we can work on a similar project together.

We can set up a phone call later this week if you’re interested in discussing starting a collaboration that adds value to our audiences.

[Email Signature]`
    }, {
      "type": "template",
      "sub_type": "application",
      "title": "Asking an Influencer to Promote Your Products",
      "content": `Hi [name of influencer],

We’ve followed your work for a while, and we like your interesting takeaways and deep dive into [subject or topic of interest].

You must be selective about the companies and collaborations you choose, so we’ve reached out about a product your audience will appreciate.

[Tell them a little about the product.]

We can offer you a 15% recurring commission over the lifetime of the customers you bring into our company.

If this sounds interesting, please tell us when you are available for a follow-up chat.

[Email Signature]`
    }, {
      "type": "template",
      "sub_type": "application",
      "title": "The Event Invite Pitch",
      "content": `Subject Line: Bloggers Invited! [Company name] Conference 2022 Showcases the Latest Industry Innovations

The [company name] brand is hosting the annual [company name] Conference [link] from [details of the event]. We want to discuss the latest [company name] innovations and offerings. Additionally, we will offer the chance for industry professionals to network.

Some of our speakers include [names and titles].

We have limited passes available for influencers and bloggers to attend.

If interested, please write a post about your experience and spread the word on your social media channels. You will receive a pass plus a discount code for your audience.

Please let us know ASAP.

[Email Signature]`
    }, {
      "type": "template",
      "sub_type": "application",
      "title": "應徵開發者",
      "content": `親愛的[專案負責人 / 團隊]，

      我是 [你的名字]，很高興看到你們正在開發一個非常有趣的 side project，並且正在尋找一名前端工程師。我認為我有能力和動機加入你們的團隊並貢獻我的技能和熱情。

      雖然我是一個自學的 ReactJS 新手，但我已經在 Udemy 上完成了幾堂課程，並且在過去的幾個月中一直在學習和實踐 ReactJS 相關技術。我認為我對 ReactJS 有一定的理解和經驗，並且能夠適應不同的需求和挑戰。我也會使用 Git 進行版本控制和團隊協作，以確保項目的高效開發和管理。

      我對你們的項目充滿熱情，並且非常想為之做出貢獻。我相信我可以和你們的團隊一起協作，並且學習和成長。如果你們覺得我是你們需要的人選，請不要猶豫聯繫我。謝謝你們的時間和考慮！

      誠摯地，
      [你的名字]`
    }, {
      "type": "template",
      "sub_type": "bio",
      "title": "Bio範本",
      "content": `我是 [你的名字]，一位自學的 [相關技術] 新手。我已經在 [學習平台] 上完成了幾門課程，並在過去幾個月中一直在學習和實踐 [相關技術] 技術。雖然我還沒有實際開發專案的經驗，但我對 [相關技術] 有一定的理解和經驗，並且致力於不斷學習和成長。

我對 [興趣領域1] 和 [興趣領域2] 非常感興趣，特別是在 [興趣領域1] 和 [興趣領域2] 領域的應用程序開發方面。

除了我的技術能力和興趣，我也是一個具有團隊合作精神的人，我相信通過團隊的努力和協作，可以創造出更好的產品和解決方案。如果你正在尋找一位有熱情、有技能的 [相關技術] 開發者，我相信我可以為你的團隊做出貢獻。

感謝你撥出時間閱讀我的自我介紹，如果你需要更多信息或者想進一步了解我的技能和經驗，請隨時與我聯繫。`
    }, {
      "type": "template",
      "sub_type": "bio",
      "title": "Bio範本",
      "content": `Greetings, everyone! I'm pivoting to a new career in UX/UI design after a decade as an urban planner. Originally from the [country], I'm now a resident of the [city]. I would love to join a project, not only to grow my budding portfolio at this early stage, but also to meet and learn from others in the industry. Can't wait to get started!`
    }, {
      "type": "template",
      "sub_type": "bio",
      "title": "Bio範本",
      "content": `Hello everyone I am Punam working in a fintech as a sr QA. In past I have worked in aviation, insurance, e-commerce and media domains. If anyone is looking for someone who can help in testing their app/ side project, please let me know. I am really looking forward work with people on a similar journey of product management. I am passionate about quality and making every product better.`
    }
  ]

  editedItem = null;

  commentContent: string = "";

  searchText: string = "";

  replyComment: string = "";
  hideall = {};

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
    private translateSrv: TranslateService
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
    this.currentUser = this.authStoreSrv.getUserData();
    this.inspirationSrv.getall().subscribe(res => {
      if (res["result"] == "successful") {

        this.allitems = res["data"];
        // this.allitems.forEach(element => {

        //   if (!this.utilitySrv.IsNullOrEmpty(element.imageUrl)) {
        //     element.imageUrl = environment.assetUrl + element.imageUrl;
        //   }
        // });
        // this.displayItems = this.allitems;
        // process_status

        // stories: any[] = [];
        // ideas: any[] = [];
        // experience: any[] = [];
        this.stories = this.allitems.filter(item => {
          return item.category == "stories"
        })

        this.ideas = this.allitems.filter(item => {
          return item.category == "ideas"
        })

        this.experience = this.allitems.filter(item => {
          return item.category == "experience"
        })

        this.displayItems = this.stories;

      }
    })


    this.inspirationForm = this.formBuilder.group({
      content: ["", Validators.required],
      metadata: [""],
      category: ["stories", Validators.required],
      type: ["content", Validators.required],
    });

  }

  get f() {
    return this.inspirationForm.controls;
  }

  inValid() {
    return this.inspirationForm.invalid;
  }

  // onSortChange(event) {
  //   if (this.currentTab === "processed") {
  //     this.displayItems = this.processed;
  //   } else if (this.currentTab === "myproposal") {
  //     this.displayItems = this.myproposals;
  //   } else {
  //     this.displayItems = this.allitems;
  //   }

  //   if (event.target.value === "") {
  //     this.displayItems.sort((a, b) => a.createdAt - b.createdAt);
  //   } else if (event.target.value === "old") {
  //     this.displayItems.sort((a, b) => b.createdAt - a.createdAt);
  //   } else if (event.target.value === "height") {
  //     this.displayItems.sort((a, b) => a.like_count - b.like_count);
  //   }

  // }

  // onSortTypeChange(event) {
  //   if (this.currentTab === "processed") {
  //     this.displayItems = this.processed;
  //   } else if (this.currentTab === "myproposal") {
  //     this.displayItems = this.myproposals;
  //   } else {
  //     this.displayItems = this.allitems;
  //   }


  //   if (!this.utilitySrv.IsNullOrEmpty(event.target.value)) {
  //     this.displayItems = this.displayItems.filter((item) => {
  //       return item.category == event.target.value
  //     });
  //   }
  // }

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

    this.inspirationSrv.insert("",
      values.content,
      values.category,
      values.type,
      values.metadata,
      "",
      this.currentUser.id).subscribe(res => {
        if (res['result'] == "successful") {
          let _new_item = {
            available: "1",
            content: values.category,
            type: values.type,
            metadata: values.metadata,
            createdAt: this.timeUtilitySrv.getCurrentUnixTimeString(),
            createdBy: this.currentUser.id,
            id: res["data"],
          }

          this.allitems.push(_new_item);
          this.inspirationForm.reset();
          document.getElementById("close_new_proposl").click();
        }
      }, (error) => {
        console.log("error", error);
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
      this.toastSrv.showToast('Share', 'copied', 'success');
    } catch (error) {
      this.toastSrv.showToast('Share', 'Failed to generate the shared link', 'error');
    }
  }
}
