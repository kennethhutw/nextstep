import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as $ from "jquery";
import { Masonry, MasonryGridItem } from "ng-masonry-grid";
import { SubscriptionLike as ISubscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [
    "./../../../../node_modules/ng-masonry-grid/ng-masonry-grid.css",
    "./home.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  _masonry: Masonry;
  private _removeAllSubscription: ISubscription;
  private _removeItemSubscription: ISubscription;
  private _removeFirstItemSubscription: ISubscription;

  buttons: Array<any> = [];
  count = 0;

  showMasonry = true;

  animOptions = { animationEffect: "effect-1" };

  masonryItems: Array<any> = [];
  title = "owlcarouselinAngular";
  Images = ["../assets/img/slider/1.jpg", "../assets/img/slider/2.jpg"];
  Brands = [
    "../assets/img/brand-logo/1.png",
    "../assets/img/brand-logo/2.png",
    "../assets/img/brand-logo/3.png",
    "../assets/img/brand-logo/4.png",
    "../assets/img/brand-logo/5.png",
    "../assets/img/brand-logo/1.png",
  ];
  items = [
    { name: "a", number: "1", date: "1360413309421", class: "purple" },
    { name: "b", number: "5", date: "1360213309421", class: "orange" },
    { name: "c", number: "10", date: "1360113309421", class: "blue" },
    { name: "d", number: "2", date: "1360113309421", class: "green" },
    { name: "e", number: "6", date: "1350613309421", class: "green" },
    { name: "f", number: "21", date: "1350613309421", class: "orange" },
    { name: "g", number: "3", date: "1340613309421", class: "blue" },
    { name: "h", number: "7", date: "1330613309001", class: "purple" },
    { name: "i", number: "22", date: "1360412309421", class: "blue" },
    { name: "add", number: 0, date: 1593068063990, class: "purple" },
    { name: "add", number: -1, date: 1593068065967, class: "purple" },
    { name: "add", number: -2, date: 1593068066706, class: "purple" },
  ];

  SlideOptions = { items: 1, dots: true, nav: true };
  CarouselOptions = { items: 3, dots: true, nav: true };

  constructor(private translateSrv: TranslateService) {
    /*  this.translateSrv.setTranslation("zh-tw", {
      HELLO: "你好",
    });
    this.translateSrv.setTranslation("en", {
      HELLO: "Hello",
    }); */
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

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * max + min);
  }

  getSrc() {
    // const width = this.getRandomInt( 300, 400 );
    // const height = this.getRandomInt( 300, 500 );
    // return 'http://lorempixel.com/'  + width + '/' + height + '/nature';

    return "assets/img/portfolio/" + this.getRandomInt(1, 10) + ".jpg";
  }

  onNgMasonryInit($event: Masonry) {
    console.log($event);
    this._masonry = $event;
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

  addItems() {
    let src = [
      { src: this.getSrc(), count: this.count++ },
      { src: this.getSrc(), count: this.count++ },
      { src: this.getSrc(), count: this.count++ },
    ];
    this._masonry.setAddStatus("add");
    this.masonryItems.push(...src);
  }

  removeFirstItem() {
    if (this._masonry) {
      this._removeFirstItemSubscription = this._masonry
        .removeFirstItem()
        .subscribe((item: MasonryGridItem) => {
          if (item) {
            let id = item.element.getAttribute("id");
            let index = id.split("-")[2];
            this.masonryItems.splice(index, 1);
          }
        });
    }
  }

  // remove all items
  removeAllItems() {
    if (this._masonry) {
      this._removeAllSubscription = this._masonry
        .removeAllItems()
        .subscribe((items: MasonryGridItem) => {
          // remove item from the list
          this.masonryItems = [];
        });
    }
  }

  // reorder items to original position
  reorderItems() {
    if (this._masonry) {
      this._masonry.reOrderItems();
    }
  }
}
