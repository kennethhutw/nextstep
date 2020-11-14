import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ArtistService } from '../../_services';


@Component({
  selector: "app-insertEdition",
  templateUrl: "./insertEdition.component.html",
  styleUrls: [
    "./insertEdition.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class InsertEditionComponent implements OnInit {

  artists = [];
  displayArtists = [];
  values = "";

  constructor(private translateSrv: TranslateService,
    private artistSrv: ArtistService) {

  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");

    this.artistSrv.getAllArtists().subscribe(data => {
      this.artists = data;
      this.displayArtists = this.splitArr(data, 3);
    });
  }

  splitArr(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }
    return newArr;
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

  onKey(event: any) { // without type info
    let key = event.target.value.toLowerCase();
    let result = this.artists.filter((value) => {
      return value.name.toLowerCase().indexOf(key) != -1 ? value : null
    });
    this.displayArtists = this.splitArr(result, 3);
    console.log("key event", key);
  }

}
