import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as $ from "jquery";
import { Masonry, MasonryGridItem } from "ng-masonry-grid";
import { SubTabsComponent } from "../../components";
import { SubscriptionLike as ISubscription } from "rxjs";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: [
    "./../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css",
    "./gallery.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GalleryComponent implements OnInit {

  currentTab = 'artworks';
  _masonry: Masonry;
  masonryItems: Array<any> = [];
  count = 0;

  private _removeAllSubscription: ISubscription;
  private _removeItemSubscription: ISubscription;
  private _removeFirstItemSubscription: ISubscription;
  showMasonry = true;
  constructor(private translateSrv: TranslateService) {
    const len = 10; // length of grid items

    for (let i = 0; i < len; i++) {
      this.masonryItems.push({
        src: this.getSrc(),
        count: this.count++,
        name: "image" + i,
      });
    }
  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");
  }

  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }
  changeTab(tab) {
    this.currentTab = tab;
  }

  getSrc() {
    // const width = this.getRandomInt( 300, 400 );
    // const height = this.getRandomInt( 300, 500 );
    // return 'http://lorempixel.com/'  + width + '/' + height + '/nature';

    return "assets/img/portfolio/" + this.getRandomInt(1, 10) + ".jpg";
  }


  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * max + min);
  }

  onNgMasonryInit($event: Masonry) {
    this._masonry = $event;
  }

  prependItems() {
    let src = [
      { src: this.getSrc(), count: this.count++ },
      { src: this.getSrc(), count: this.count++ },
      { src: this.getSrc(), count: this.count++ },
    ];
    this._masonry.setAddStatus("prepend");
    this.masonryItems.splice(0, 0, ...src);
  }

  // append items to existing masonry
  appendItems() {
    let src = [
      { src: this.getSrc(), count: this.count++ },
      { src: this.getSrc(), count: this.count++ },
      { src: this.getSrc(), count: this.count++ },
    ];
    this._masonry.setAddStatus("append");
    this.masonryItems.push(...src);
  }

  // done without images
  removeItem(item: any) {
    if (this._masonry) {
      const elem = document.querySelector("#" + item);
      this._removeItemSubscription = this._masonry
        .removeItem(elem)
        .subscribe((item: MasonryGridItem) => {
          if (item) {
            let id = item.element.getAttribute("id");
            let index = id.split("-")[2];
            this.masonryItems.splice(index, 1);
          }
        });
    }
  }


}
