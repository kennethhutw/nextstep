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
