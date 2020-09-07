import {
  Component,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-artworklogo",
  templateUrl: "./artworklogo.component.html",
  styleUrls: ["./artworklogo.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtWorkLogoComponent {
  @Input() records: any[];
}
