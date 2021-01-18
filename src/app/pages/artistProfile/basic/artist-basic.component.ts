import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
    AppSettingsService,
    ArtistService,
    AuthStore
} from '../../../_services';
import {
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { resResult,NewArtist } from "../../../_models";
import { Utility } from "src/app/_helpers";
import { environment } from '../../../../environments/environment';

@Component({
  selector: "app-artist-basic",
  templateUrl: "./artist-basic.component.html",
  styleUrls: ["./artist-basic.component.css"],
})
export class ArtistBasicComponent implements OnInit {

  popularEditions = [];
  countriesOptions: any;
  profileImage :any;
  profileImageFile :any;

  profileForm: FormGroup;
  loading = false;
  submitted = false;
  IsUpdateFailed = false;
  informMsg = null;
  currentUser :any;
  constructor(
    private utility : Utility,
    private artistSrv:ArtistService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private formBuilder: FormBuilder,
    private authStoreSrv:AuthStore) {}

  ngOnInit() {
    this.appSettingsSrv.getCountryOptions().subscribe(data => {
        this.countriesOptions = data;
    });
    this.profileForm = this.formBuilder.group({
      name: [""],
      bio: [""],
      location: [""],
      website: [""],
      facebook: [""],
      twitter: [""],
      instagram: [""]
    });

    this.currentUser = this.authStoreSrv.getUserData();
    if(!this.utility.IsNullOrEmpty(this.currentUser ))
    {
      this.artistSrv.getArtistBasicInfo(this.currentUser.id).subscribe(res=>{
        if(res["result"] ==="successful"){
          let _currentUser = res["data"];
          let _location = _currentUser.country;
          if(this.utility.IsNullOrEmpty(_location))
          {
            _location = "";
          }
            this.profileForm.setValue({
              name: _currentUser.name,
              bio: _currentUser.bio,
              location:_location,
              website:_currentUser.website,
              facebook:_currentUser.facebook,
              twitter:_currentUser.twitter,
              instagram:_currentUser.instagram,
            });
            if(!this.utility.IsNullOrEmpty(_currentUser.imageUrl ))
            {
              this.profileImage =  environment.assetUrl+_currentUser.imageUrl ;
            }
        }
      },error=>{
        console.error("getArtistBasicInfo failed",error);
      });

    }
  }

  onRemoveImg(event) {
    this.profileImage = null;
    this.profileImageFile = null;
  }

  onDetectImage(event) {
    if ( event.target.files.length === 0)
      return;

    var mimeType =  event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.profileImageFile = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.profileImage = reader.result;
    }
  }

  onSubmit(){
    let newArtist = new NewArtist();
    newArtist.name =  this.profileForm.value.name;
    newArtist.bio = this.profileForm.value.bio;
    newArtist.location = this.profileForm.value.location;
    newArtist.facebook = this.profileForm.value.facebook;
    newArtist.website = this.profileForm.value.website;
    newArtist.twitter = this.profileForm.value.twitter;
    newArtist.instagram = this.profileForm.value.instagram;

    let formData = new FormData();
    formData.append("id",  this.currentUser.id);
    formData.append("uid",  this.currentUser.id);
    formData.append("name",  newArtist.name);
    formData.append("bio",  newArtist.bio);
    formData.append("facebook",  newArtist.facebook);
    formData.append("location",  newArtist.location);
    formData.append("website",  newArtist.website);
    formData.append("twitter",  newArtist.twitter);
    formData.append("instagram",  newArtist.instagram);
    formData.append("profileImage", this.profileImageFile);

    this.artistSrv.updateArtistBasicInfo(formData).subscribe(res =>{
      if (res["result"] === "successful") {
        this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
            this.informMsg = text;
        });
      }
      else {
        this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
            this.informMsg = text;
            this.IsUpdateFailed = true;
        });
      }
    }, error=>{
      this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
            this.informMsg = text;
            this.IsUpdateFailed = true;
      });
      console.error("update Basic infor failed",error);
    });
  }
}
