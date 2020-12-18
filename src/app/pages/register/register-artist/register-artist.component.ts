import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DataService,AuthStore } from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { NewArtist, ApplyEdition } from "./../../../_models";

import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormArray
} from "@angular/forms";

@Component({
  selector: "app-register-artist",
  templateUrl: "./register-artist.component.html",
  styleUrls: ["./register-artist.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterArtistComponent implements OnInit {
  popularEditions = [];
  recentEditions = [];

  IsAgree = false;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  newEditions =[];

  theFirstImage :any;
  theFirstImageNameRequire = false;
  theSecondImage :any;
  theSecodnImageNameRequire = false;
  theThirdImage :any;
theThirdImageNameRequire = false;
  constructor(
    private authStore:AuthStore,
    private formBuilder: FormBuilder,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService
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

    for(let i = 0; i <3 ;i++){
     // let _newEdition = new ApplyEdition();
      let _newEdition = this.formBuilder.group({
        name: [""],
        description:[""],
        imageName:[""],
        imageUrl:[""],
        imageSize:[""]
      });
      this.newEditions.push(_newEdition);
    }
    this.registerForm = this.formBuilder.group({
      name: ["Ariel", Validators.required],
      email: [
        "arielhuang1202@gmail.com",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      location: ["Taiwan", Validators.required],
      website: ["https://arielhuang1202.wixsite.com/huaiyuanartworks"],
      facebook: [""],
      twitter: [""],
      instagram: [""],
      blog: [""],
      editions: this.formBuilder.array(this.newEditions)
    });
    localStorage.clear();
  }

  //   onDetectCompLogo(event) {
  //   this.uploadedCompLogo = false;
  //   this.selectedMaterial = event.target.files;
  //   this.complogoFile = '';
  //   this.IsAnyNewImage = ImageState.new;
  //   this.preview(this.selectedMaterial);
  //      let file = this.selectedMaterial.item(0);
  // }

    onDetectImage(event, index) {
    if ( event.target.files.length === 0)
      return;

    var mimeType =  event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {

      return;
    }

    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      let controls =  this.registerForm.controls["editions"];
      this.theFirstImage = reader.result;
      controls["controls"][index].patchValue( {imageUrl:reader.result});
    //  controls["controls"][index].patchValue( {name:reader.result});
     // this.imgURL = reader.result;
    }
  }


  get f() {
    return this.registerForm.controls;
  }

  inValid() {
    return this.registerForm.invalid;
  }
  onSubmit(){

     if (this.registerForm.invalid) {
      return;
    }

    let newArtist = new NewArtist();
    newArtist.name =  this.registerForm.value.name;
    newArtist.email =  this.registerForm.value.email;
    newArtist.location = this.registerForm.value.location;
    newArtist.website = this.registerForm.value.website;
    newArtist.twitter = this.registerForm.value.twitter;
    newArtist.instagram = this.registerForm.value.instagram;
    newArtist.blog = this.registerForm.value.blog;

    const _editions = this.registerForm.get('editions') as FormArray;

 console.log("_editions ================= "+_editions);
    for(let i =0; i < _editions.controls.length ; i++){
      let _edition = _editions.controls[i];
       console.log("_edition ================= "+_edition);
      if(!this.utility.IsNullOrEmpty(_edition.value.imageUrl)){
         console.log("_edition imageUrl ================= "+_edition.value.imageUrl);
         _edition.setErrors({'required': true});
      }
    }
    let formData = new FormData();
    formData.append("name",  newArtist.name);
    formData.append("email",  newArtist.email);
    formData.append("location",  newArtist.location);
    formData.append("website",  newArtist.website);
    formData.append("twitter",  newArtist.twitter);
    formData.append("instagram",  newArtist.instagram);
    formData.append("blog",  newArtist.blog);

     return;

    //  this.authStore.ArtistSignup(formData).subscribe(res =>{
    //       console.log(" ================= "+res);
    //  });

  }
}
