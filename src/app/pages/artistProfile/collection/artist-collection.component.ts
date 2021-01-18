import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from '../../../../environments/environment';
import {
  DataService,
  AppSettingsService,
  ArtistService,
  AuthStore,
  EditionService } from "./../../../_services";
import { Utility } from "./../../../_helpers";

@Component({
  selector: "app-artist-collection",
  templateUrl: "./artist-collection.component.html",
  styleUrls: ["./artist-collection.component.css"],
})
export class ArtistCollectionComponent implements OnInit {

  currentUser :any;
  artworks=[];
  constructor(
    private dataSrv:DataService,
    private utility : Utility,
    private artistSrv:ArtistService,
    private editionSrv:EditionService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private authStoreSrv:AuthStore) {}

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();

    this.editionSrv.getArtwrokByArtistId(this.currentUser.id).subscribe(res=>{
      console.log(" ===================== ", res);
      if(res['result'] === 'successful'){
        this.artworks = res['data'];
      }
    })
  }


  getImageURL(path){
    return environment.assetAPIUrl+path;
  }

  getImageStatus(status){
    switch(status){
      case "0":
        return "審核中";
      break;
      case "1":
          return "上架中";
        break;
         case "2":
          return "已上架";
        break;
         case "3":
          return "競價中";
        break;
         case "4":
          return "已下架";
        break;
    }
  }
}
