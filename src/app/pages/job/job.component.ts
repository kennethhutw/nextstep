import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  RecruitService,
  DataService,
  AppSettingsService,
  SettingService
} from "../../_services";
import { Utility } from "../../_helpers";
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.css"]
})
export class JobComponent implements OnInit {
  items = [{
    name: "Kenneth",
    position: "Software developer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar2.png",
    isFavortie: false,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "full-stack",
      "blockchain"
    ]

  },
  {
    name: "Anne",
    position: "UI/UX designer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar3.png",
    isFavortie: true,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "UI/UX",
      "Front-end"
    ]
  },
  {
    name: "Ken",
    position: "DevOps developer",
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar4.png",
    isFavortie: false,
    isFollow: false,
    description: "添加到收藏夹",
    tags: [
      "DevOps ",
      "IT"
    ]
  }];
  currentRecruit;
  selectedItem;
  constructor(
    private settingSrv: SettingService,
    private recruitSrv: RecruitService,
    private utility: Utility,
    private route: ActivatedRoute,
    private appSettingsSrv: AppSettingsService,
    private SpinnerService: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.SpinnerService.show();
    let id = this.route.snapshot.paramMap.get("id");
    this.recruitSrv.getById(id).then(res => {
      if (res['result'] == 'successful') {
        this.currentRecruit = res['data'];
        console.log("==================", this.currentRecruit);
      }
      this.SpinnerService.hide();
    }).catch(error => {
      console.error("error", error);
      this.SpinnerService.hide();
    })
  }

  onSave() { }

  onSelectItem(item) {
    this.selectedItem = item;
  }

  onSubmit() {

  }

  onImgError(event) {
    event.target.src = "assets/images/defaultlogo.png";
  }
}
//https://www.sliderrevolution.com/resources/bootstrap-profile/
