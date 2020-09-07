import {
  Component,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistComponent {
  @Input() id: string;
  @Input() src: string;
  @Input() artistId: string;

  @Input() name: string;
  @Input() bio: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }
  GetArtistURL() {
    return "/token" + this.artistId;
  }

  routeToArtistProfile() {

    this.router.navigate(["./artist/" + this.artistId], {});
  }


}
