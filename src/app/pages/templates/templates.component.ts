import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import {
  ToastService,
} from "../../_services";
@Component({
  selector: "app-templates",
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.scss"]
})
export class TemplatesComponent implements OnInit {

  @ViewChild('closebutton') closebutton;

  templates = [
    {
      "title": "The Mutual Relationship Pitch",
      "content": `Subject Line: Mutual Relationship Marketing Collaboration Project

Hi [name],

      I’m [name] from[company name].I’ve followed your blog since 2016.

Your recent posts[write one or a few topics] resonate with me, and I thought it was something our company's audience would appreciate, and I shared it with our email subscribers and on all our social media platforms.

I want to discuss[topic] and see if we can work on a similar project together.

We can set up a phone call later this week if you’re interested in discussing starting a collaboration that adds value to our audiences.

[Email Signature]`
    }, {
      "title": "Asking an Influencer to Promote Your Products",
      "content": `Hi [name of influencer],

We’ve followed your work for a while, and we like your interesting takeaways and deep dive into [subject or topic of interest].

You must be selective about the companies and collaborations you choose, so we’ve reached out about a product your audience will appreciate.

[Tell them a little about the product.]

We can offer you a 15% recurring commission over the lifetime of the customers you bring into our company.

If this sounds interesting, please tell us when you are available for a follow-up chat.

[Email Signature]`
    }, {
      "title": "The Event Invite Pitch",
      "content": `Subject Line: Bloggers Invited! [Company name] Conference 2022 Showcases the Latest Industry Innovations

The [company name] brand is hosting the annual [company name] Conference [link] from [details of the event]. We want to discuss the latest [company name] innovations and offerings. Additionally, we will offer the chance for industry professionals to network.

Some of our speakers include [names and titles].

We have limited passes available for influencers and bloggers to attend.

If interested, please write a post about your experience and spread the word on your social media channels. You will receive a pass plus a discount code for your audience.

Please let us know ASAP.

[Email Signature]`
    }, {
      "title": "要求加入團隊",
      "content": `親愛的[專案負責人 / 團隊]，

      我是 [你的名字]，很高興看到你們正在開發一個非常有趣的 side project，並且正在尋找一名前端工程師。我認為我有能力和動機加入你們的團隊並貢獻我的技能和熱情。

      雖然我是一個自學的 ReactJS 新手，但我已經在 Udemy 上完成了幾堂課程，並且在過去的幾個月中一直在學習和實踐 ReactJS 相關技術。我認為我對 ReactJS 有一定的理解和經驗，並且能夠適應不同的需求和挑戰。我也會使用 Git 進行版本控制和團隊協作，以確保項目的高效開發和管理。

      我對你們的項目充滿熱情，並且非常想為之做出貢獻。我相信我可以和你們的團隊一起協作，並且學習和成長。如果你們覺得我是你們需要的人選，請不要猶豫聯繫我。謝謝你們的時間和考慮！

      誠摯地，
      [你的名字]`
    }
  ]

  currentUser;

  constructor(
    private toastr: ToastService
  ) {

  }

  ngOnInit() {

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
      this.toastr.showToast('Share', 'copied', 'success');
    } catch (error) {
      this.toastr.showToast('Share', 'Failed to generate the shared link', 'error');
    }
  }
  /*
         this.toastr.showToast('Success', "新增評語成功", this.toastr.iconClasses.success);
          }
        }, (error => {
    this.toastr.showToast('Failed', "新增評語失敗", this.toastr.iconClasses.error);
  })) */


}
