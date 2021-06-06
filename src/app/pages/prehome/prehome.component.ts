import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  ArtWorkService,
  SettingService
} from "./../../_services";
import { Utility } from "./../../_helpers";
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, Routes } from '@angular/router';

@Component({
  selector: "app-preview-home",
  templateUrl: "./prehome.component.html",
  styleUrls: [
    "./prehome.component.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PreviewHomeComponent implements OnInit {
  popularEditions = [];
  recentEditions = [];

  default_main_bg = "./assets/images/main-bg.jpg";

  main_bg = "./assets/images/test.jpg";

  base64textString = [];

  popularDisplayEditions: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(
    private settingSrv: SettingService,
    private translateSrv: TranslateService,
    private utility: Utility,
    private route: ActivatedRoute,
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

    let id = this.route.snapshot.paramMap.get("id");
    console.log(" ======================= id", id);
    this.settingSrv.getSettingById(id).subscribe(res => {
      if (res["result"] == "successful") {
        this.main_bg = environment.assetUrl + res["data"];
        console.log("getSettingById ======================= res", res);
      }
    })

    this.artworkSrv.getPopularArtwork().subscribe(res => {

      if (res["result"] == "successful") {
        this.popularEditions = res["data"];
        this.popularEditions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          element.ethValue = element.ethValue / 100;
        });
        // this.popularDisplayEditions = this.chunk(this.popularEditions, 3);
      }
    });

    this.artworkSrv.getLatestArtWork().subscribe(res => {

      if (res["result"] == "successful") {
        this.recentEditions = res["data"];
        this.recentEditions.forEach((element) => {
          element.imageUrl = environment.assetUrl + element.imageUrl;
          element.ethValue = element.ethValue / 100;
        });
      }
    });

    this.dataSrv.previewBGKey.subscribe((image) => {
      console.log(" =======================", image);
      if (!this.utility.IsNullOrEmpty(image)) {
        this.main_bg = image;
      }
    });


  }

  setMyStyles() {
    let styles = {
      'background-image': 'url("' + this.main_bg + '")',
    };
    //{background-image: 'url( main_bg)'}
    return styles;
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    console.log("base64 ============", this.base64textString);

    this.main_bg = 'data:image/png;base64,' + btoa(e.target.result);
  }

}
