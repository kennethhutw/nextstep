import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import {
  ToastService,
} from "../../_services";
import { DomSanitizer } from "@angular/platform-browser";
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
      "type": "application",
      "title": "應徵開發者",
      "content": `親愛的[專案負責人 / 團隊]，

      我是 [你的名字]，很高興看到你們正在開發一個非常有趣的 side project，並且正在尋找一名前端工程師。我認為我有能力和動機加入你們的團隊並貢獻我的技能和熱情。

      雖然我是一個自學的 ReactJS 新手，但我已經在 Udemy 上完成了幾堂課程，並且在過去的幾個月中一直在學習和實踐 ReactJS 相關技術。我認為我對 ReactJS 有一定的理解和經驗，並且能夠適應不同的需求和挑戰。我也會使用 Git 進行版本控制和團隊協作，以確保項目的高效開發和管理。

      我對你們的項目充滿熱情，並且非常想為之做出貢獻。我相信我可以和你們的團隊一起協作，並且學習和成長。如果你們覺得我是你們需要的人選，請不要猶豫聯繫我。謝謝你們的時間和考慮！

      誠摯地，
      [你的名字]`
    }, {
      "type": "bio",
      "title": "Bio範本",
      "content": `我是 [你的名字]，一位自學的 [相關技術] 新手。我已經在 [學習平台] 上完成了幾門課程，並在過去幾個月中一直在學習和實踐 [相關技術] 技術。雖然我還沒有實際開發專案的經驗，但我對 [相關技術] 有一定的理解和經驗，並且致力於不斷學習和成長。

我對 [興趣領域1] 和 [興趣領域2] 非常感興趣，特別是在 [興趣領域1] 和 [興趣領域2] 領域的應用程序開發方面。

除了我的技術能力和興趣，我也是一個具有團隊合作精神的人，我相信通過團隊的努力和協作，可以創造出更好的產品和解決方案。如果你正在尋找一位有熱情、有技能的 [相關技術] 開發者，我相信我可以為你的團隊做出貢獻。

感謝你撥出時間閱讀我的自我介紹，如果你需要更多信息或者想進一步了解我的技能和經驗，請隨時與我聯繫。`
    }, {
      "type": "bio",
      "title": "Bio範本",
      "content": `Greetings, everyone! I'm pivoting to a new career in UX/UI design after a decade as an urban planner. Originally from the [country], I'm now a resident of the [city]. I would love to join a project, not only to grow my budding portfolio at this early stage, but also to meet and learn from others in the industry. Can't wait to get started!`
    }, {
      "type": "bio",
      "title": "Bio範本",
      "content": `Hello everyone I am Punam working in a fintech as a sr QA. In past I have worked in aviation, insurance, e-commerce and media domains. If anyone is looking for someone who can help in testing their app/ side project, please let me know. I am really looking forward work with people on a similar journey of product management. I am passionate about quality and making every product better.`
    }
  ]

  currentUser;
  type: string = "";
  displayItems = [];

  constructor(
    private sanitizer: DomSanitizer,
    private toastr: ToastService
  ) {

  }

  ngOnInit() {
    this.displayItems = this.templates;
  }

  onFilterChange(event) {
    if (event.target.value == "") {
      this.displayItems = this.templates;
    } else {
      this.displayItems = this.templates.filter((item) => {
        return item.type == event.target.value
      });
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
      this.toastr.showToast("", 'copied', 'success');
    } catch (error) {
      this.toastr.showToast("", 'Failed to copy', 'error');
    }
  }

}
