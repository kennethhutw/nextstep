import {
  Component,
  Output,
  Input,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import { Utility } from "../../_helpers";
import {
  DataService,
} from "../../_services";

import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "ui-email-template-card",
  templateUrl: "./emailTemplateCard.component.html",
  styleUrls: ["./emailTemplateCard.component.scss"],

  encapsulation: ViewEncapsulation.None
})
export class EmailTemplateCardComponent {
  @Input() template;
  @Input() user;

  @Output() CopyText: EventEmitter<{ isSuccessful: boolean }> = new EventEmitter<{ isSuccessful: boolean }>();

  constructor(
    private utility: Utility,
    private dataSrv: DataService,
    private translateSrv: TranslateService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });
  }




  ngOnInit() {
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
      }
    });

  }



  onClickCopyText(content) {
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
  }


}
//https://www.bootdey.com/snippets/view/Assign-Project-List#html
