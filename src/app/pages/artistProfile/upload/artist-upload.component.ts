import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  DataService,
  AppSettingsService,
  ArtistService,
  AuthStore,
  EditionService } from "./../../../_services";
import { Utility } from "./../../../_helpers";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-artist-upload",
  templateUrl: "./artist-upload.component.html",
  styleUrls: ["./artist-upload.component.css"],
})
export class ArtistUploadComponent implements OnInit {

  artworkImage :any;
  artworkImageFile :any;

  artworkForm: FormGroup;
  loading = false;
  submitted = false;
  IsUpdateFailed = false;
  informMsg = null;
  currentUser :any;
  ethPrice = 0;
  ethAmount :Number =0;

  tags = [];
   isReadonly = true;
  constructor(
    private dataSrv:DataService,
    private utility : Utility,
    private artistSrv:ArtistService,
    private editionSrv:EditionService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private formBuilder: FormBuilder,
    private authStoreSrv:AuthStore) {}

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    if(!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE")))
    {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }

     this.artworkForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      IsBid: [false],
      sellingPrice: [0],
      paymentway:[0],
      numberOfArtwork: ["", Validators.required],
      tags: ["", Validators.required]
    });

    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
      this.initTags(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.initTags(lang);
      }
    });
  }

  initTags(lang) {
    this.appSettingsSrv.getTagOptions(lang).subscribe((data) => {
      this.tags = data;
    });
  }

  public getSelected() {
    this.isReadonly = false;
    let result = this.tags.filter((ch) => { return ch.selected })
                     .map((ch) => { return ch.value });

    let _tags_string = result.toString();
    this.artworkForm.patchValue({ tags: _tags_string });
    this.isReadonly = true;
  }

  onRemoveImg(event) {
    this.artworkImage = null;
    this.artworkImageFile = null;
  }

  TotalETHAmount(event){
    if(!this.utility.IsNullOrEmpty(event.target.value))
    {
      let usd  = parseFloat( event.target.value)
      this.ethAmount =+( usd/this.ethPrice).toFixed(3);
    }
  }

  onDetectImage(event) {
    if ( event.target.files.length === 0)
      return;

    var mimeType =  event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.artworkImageFile = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.artworkImage = reader.result;
    }
  }

  onSubmit(){
    this.submitted = true;
     this.IsUpdateFailed = false;
      this.informMsg =null;

    if(this.artworkImageFile == null){
      return;
    }



    // let newArtist = new NewArtist();
    // newArtist.name =  this.profileForm.value.name;
    // newArtist.bio = this.profileForm.value.bio;
    // newArtist.location = this.profileForm.value.location;
    // newArtist.facebook = this.profileForm.value.facebook;
    // newArtist.website = this.profileForm.value.website;
    // newArtist.twitter = this.profileForm.value.twitter;
    // newArtist.instagram = this.profileForm.value.instagram;

    let formData = new FormData();
    formData.append("artistId", this.currentUser.id);
    formData.append("uid", this.currentUser.id);
    formData.append("name", this.artworkForm.value.name);
    formData.append("description", this.artworkForm.value.description);
    formData.append("tags", this.artworkForm.value.tags);
    formData.append("isBid", this.artworkForm.value.IsBid);
    formData.append("paymentway", this.artworkForm.value.paymentway);
    formData.append("usdprice", this.artworkForm.value.sellingPrice);
    formData.append("totalamount", this.artworkForm.value.numberOfArtwork);
     formData.append("uploadfile", this.artworkImageFile );

    this.editionSrv.createArtwrok(formData).subscribe(res =>{
       if (res["result"] === "successful") {
         this.translateSrv.get("UPDATEDSUCC").subscribe((text: string) => {
             this.informMsg = text;
         });
         this.artworkForm.reset();
         this.artworkImageFile = null;
         this.artworkImage=null;
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
