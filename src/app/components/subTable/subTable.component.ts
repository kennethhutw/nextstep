import {
  Component,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-subtable",
  templateUrl: "./subTable.component.html",
  styleUrls: ["./subTable.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SubTableComponent {
  @Input() records: any[];
}
