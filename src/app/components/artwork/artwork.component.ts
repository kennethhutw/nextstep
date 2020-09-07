import {
  Component,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-artwork",
  templateUrl: "./artwork.component.html",
  styleUrls: ["./artwork.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtWorkComponent {
  @Input() id: string;
  @Input() src: string;
  @Input() editionId: string;
  @Input() avaiableAmount: string;
  @Input() name: string;
  @Input() impression: string;
  @Input() quantity: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }
  GetEditionURL() {
    return "/token" + this.editionId;
  }

  routeToEdition() {

    this.router.navigate(["./token/" + this.editionId], {});
  }

  GetAvailableAmount() {
    return this.avaiableAmount.toString() + "  available";
  }

  GetImpressionQuantity() {
    return "#" + this.impression.toString() +
      " of " + this.quantity.toString();
  }
}
