import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-subtab",
  templateUrl: "./subTab.component.html",
  styleUrls: ["./subTab.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SubTabComponent {
  @Input('tabTitle') title: string;
  @Input() active = false;
  constructor(private translateSrv: TranslateService) { }

  ngOnInit() {

  }
}
