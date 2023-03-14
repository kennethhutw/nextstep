import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  LandingService,
  SettingService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
import { GoogleAnalyticsService } from "../../_services"; // import our analytics service
import { SwiperComponent } from "swiper/angular";
import SwiperCore, {
  SwiperOptions,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
} from "swiper";
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [
    "./home.component.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  // popularProjects = [];
  popularUsers = [];
  popularMentors = [];
  popularProjects = [];
  // recentProjects = [];
  // popularUsers = [{
  //   name: "John Doe",
  //   position: "Front End Developer",
  //   type: "Startup"
  // }, {
  //   name: "Kitty",
  //   description: "UI/UX Designer",
  //   type: "Startup"
  // }, {
  //   name: "Eduardo Braga",
  //   description: "Product manager",
  //   type: "Startup"
  // }, {
  //   name: "Chhail Khalsa",
  //   description: "UI Designer",
  //   type: "Startup"
  // }];
  // popularMentors = [{
  //   name: "John Doe",
  //   position: "Front End Developer",
  //   type: "Startup"
  // }, {
  //   name: "Kitty",
  //   description: "UI/UX Designer",
  //   type: "Startup"
  // }, {
  //   name: "Eduardo Braga",
  //   description: "Product manager",
  //   type: "Startup"
  // }, {
  //   name: "Chhail Khalsa",
  //   description: "UI Designer",
  //   type: "Startup"
  // }];

  default_main_bg = "./assets/images/home1.jpg";

  main_bg = "./assets/images/home.svg";


  popularDisplayEditions: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
  @ViewChild("swiperRef") swiperRef?: SwiperComponent;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,

    loop: true,
    loopFillGroupWithBlank: true,
    navigation: false,
    pagination: { clickable: false },
    scrollbar: { draggable: false },

    breakpoints: {
      991: {
        slidesPerView: 3,
        spaceBetween: 10
      }
    }
  };

  constructor(
    private gaSrv: GoogleAnalyticsService,
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private landingSrv: LandingService,
    private cdf: ChangeDetectorRef,
  ) {

    // let _lang = localStorage.getItem("lang");
    // if (!this.utility.IsNullOrEmpty(_lang)) {
    //   this.translateSrv.use(_lang);
    // }
    // this.dataSrv.langKey.subscribe((lang) => {
    //   if (!this.utility.IsNullOrEmpty(lang)) {
    //     this.translateSrv.use(lang);
    //   }
    // });
  }

  ngOnInit() {
    this.translateSrv.use("zh-tw");
    this.landingSrv.getall().then(res => {

      if (res['result'] == 'successful') {
        this.popularProjects = res['projects'];
        this.popularUsers = res['partners'];
        if (this.popularUsers && this.popularUsers.length > 0) {
          this.popularUsers.forEach(element => {
            if (!this.utility.IsNullOrEmpty(element.tags)) {
              element.tags = element.tags.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.interested)) {
              element.interested = element.interested.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.imageUrl)) {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            }
          });
        }
        this.popularMentors = res['mentors'];
        if (this.popularMentors && this.popularMentors.length > 0) {
          this.popularMentors.forEach(element => {
            if (!this.utility.IsNullOrEmpty(element.tags)) {
              element.tags = element.tags.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.interested)) {
              element.interested = element.interested.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.expertise)) {
              element.expertise = element.expertise.split(',');
            }
            if (!this.utility.IsNullOrEmpty(element.imageUrl)) {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            }
          });
        }
      }
      this.cdf.detectChanges();
    }).catch(error => {
      console.error("error", error);

    })
    this.swiperConfig = {
      slidesPerView: 1,
      spaceBetween: 10,
      slidesPerGroup: 3,
      loop: true,
      loopFillGroupWithBlank: true,
      navigation: true,


      breakpoints: {
        991: {
          slidesPerView: 3,
          spaceBetween: 10
        }
      }
    };
  }

  setMyStyles() {
    let styles = {
      'background-image': 'url("' + this.main_bg + '")',
    };
    //{background-image: 'url( main_bg)'}
    return styles;
  }


}
