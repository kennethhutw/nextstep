import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService, ArtWorkService } from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
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
  popularEditions = [];
  recentEditions = [];
  cards = [
    {
      title: 'Card Title 1',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 2',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 3',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 4',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 5',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 6',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 7',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 8',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
    {
      title: 'Card Title 9',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content',
      buttonText: 'Button',
      img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    },
  ];

  slides: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private artworkSrv: ArtWorkService
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
    this.slides = this.chunk(this.cards, 3);
    // this.popularEditions = [
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-a1.jpg",
    //     editionId: "2000123",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-a2.jpg",
    //     editionId: "2000124",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-a3.jpg",
    //     editionId: "2000125",
    //   },
    // ];
    this.artworkSrv.getPopularArtwork().subscribe(res => {

      if (res["result"] == "successful") {
        this.popularEditions = res["data"];
        this.popularEditions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
        });
      }
    });

    this.artworkSrv.getLatestArtWork().subscribe(res => {

      if (res["result"] == "successful") {
        this.recentEditions = res["data"];
        this.recentEditions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
        });
      }
    });
    // this.recentEditions = [
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
    //     editionId: "2000123",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
    //     editionId: "2000124",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
    //     editionId: "2000123",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
    //     editionId: "2000124",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
    //     editionId: "2000123",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
    //     editionId: "2000124",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm too more words",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b1.jpg",
    //     editionId: "2000123",
    //   },
    //   {
    //     editionTitle: "The Calm And The Storm",
    //     editionAuthor: "Andrew Shiao",
    //     editionImg: "./../../../assets/images/main-thumbnail-b2.jpg",
    //     editionId: "2000124",
    //   },
    // ];
  }
}
