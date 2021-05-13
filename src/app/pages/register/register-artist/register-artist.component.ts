import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AuthStore,
  DialogService,
  EmailService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { NewArtist, ApplyEdition } from "./../../../_models";
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
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
  newEditions = [];

  theFirstImage: any;
  theFirstImageNameRequire = false;
  theSecondImage: any;
  theSecodnImageNameRequire = false;
  theThirdImage: any;
  theThirdImageNameRequire = false;
  message = null;

  verifiedMsg = "";
  constructor(
    private router: Router,
    private dialogSrv: DialogService,
    private authStore: AuthStore,
    private formBuilder: FormBuilder,
    private translateSrv: TranslateService,
    private utility: Utility,
    private dataSrv: DataService,
    private EmailSrv: EmailService
  ) {
    let _lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(_lang)) {
      this.translateSrv.use(_lang);
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.translateSrv.use(lang);
        this.translateSrv.get("ARTISTREGISTER").subscribe((text: string) => {
          this.verifiedMsg = text;
        });
      }
    });
  }

  ngOnInit() {

    for (let i = 0; i < 3; i++) {
      // let _newEdition = new ApplyEdition();
      let _newEdition = this.formBuilder.group({
        name: [""],
        description: [""],
        imageName: [""],
        imageUrl: [""],
        imageSize: [""],
        image: [null],
      });
      this.newEditions.push(_newEdition);
    }
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      location: [""],
      website: [""],
      facebook: [""],
      twitter: [""],
      instagram: [""],
      blog: [""],
      editions: this.formBuilder.array(this.newEditions)
    });
    localStorage.clear();

    this.translateSrv.get("ARTISTREGISTER").subscribe((text: string) => {
      this.verifiedMsg = text;
    });

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
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {

      return;
    }
    console.log("event.target.files[0]", event.target);
    var reader = new FileReader();
    let controls = this.registerForm.controls["editions"];
    controls["controls"][index].patchValue({ image: event.target.files[0] });
    controls["controls"][index].patchValue({ name: event.target.files[0].name });
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {


      switch (index) {
        case 0:
          this.theFirstImage = reader.result;
          break;
        case 1:
          this.theSecondImage = reader.result;
          break;
        case 2:
          this.theThirdImage = reader.result;
          break;
      }
      controls["controls"][index].patchValue({ imageUrl: reader.result });
      //controls["controls"][index].patchValue({ name: reader.result });
      // this.imgURL = reader.result;
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  inValid() {
    return this.registerForm.invalid;
  }

  onRemoveImg(event, imagePosition) {
    let controls = this.registerForm.controls["editions"];
    controls["controls"][imagePosition].patchValue({ image: null });
    controls["controls"][imagePosition].updateValueAndValidity();
    if (imagePosition === "0") {
      this.theFirstImage = null;
      const element = document.querySelector('#theFirstImageInput');
      if (!!element) {
        element['value'] = null;
      }

    } else if (imagePosition === "1") {
      this.theSecondImage = null;
      const element = document.querySelector('#theSecondImageInput');
      if (!!element) {
        element['value'] = null;
      }

    } else if (imagePosition === "2") {
      this.theThirdImage = null;
      const element = document.querySelector('#theThirdImageInput');
      if (!!element) {
        element['value'] = null;
      }

    }
  }

  onSubmit() {
    this.loading = true;
    this.message = null;
    this.theFirstImageNameRequire = false;
    this.theSecodnImageNameRequire = false;
    this.theThirdImageNameRequire = false;
    if (this.registerForm.invalid) {
      this.loading = false;
      this.message = "Name or Email cannot be empty";
      return;
    }
    const _editions = this.registerForm.get('editions') as FormArray;
    for (let i = 0; i < _editions.controls.length; i++) {
      let _edition = _editions.controls[i];
      // _edition.setErrors({'required': false});
      if (!this.utility.IsNullOrEmpty(_edition.value.imageUrl) &&
        !this.utility.IsNullOrEmpty(_edition.value.name)) {

        //_edition.setErrors({'required': true});
        switch (i) {
          case 0:
            this.theFirstImageNameRequire = true;
            //return;
            break;
          case 1:
            this.theSecodnImageNameRequire = true;
            //  return;
            break;
          case 2:
            this.theThirdImageNameRequire = true;
            //  return;
            break;
        }

      }
    }

    if (!this.theFirstImageNameRequire &&
      !this.theSecodnImageNameRequire &&
      !this.theThirdImageNameRequire) {
      this.loading = false;
      this.message = "Please upload your artwork(s).";
      return;
    }

    let newArtist = new NewArtist();
    newArtist.name = this.registerForm.value.name;
    newArtist.email = this.registerForm.value.email;
    newArtist.location = this.registerForm.value.location;
    newArtist.website = this.registerForm.value.website;
    newArtist.twitter = this.registerForm.value.twitter;
    newArtist.facebook = this.registerForm.value.facebook;
    newArtist.instagram = this.registerForm.value.instagram;
    newArtist.blog = this.registerForm.value.blog;


    let formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("email", newArtist.email);
    formData.append("location", newArtist.location);
    formData.append("website", newArtist.website);
    formData.append("facebook", newArtist.facebook);
    formData.append("twitter", newArtist.twitter);
    formData.append("instagram", newArtist.instagram);
    formData.append("blog", newArtist.blog);


    if (!this.utility.IsNullOrEmpty(_editions.controls[0].value.image)) {
      formData.append('firstImage', _editions.controls[0].value.image);
      formData.append('firstImageName', _editions.controls[0].value.name);
      formData.append('firstImageDescription', _editions.controls[0].value.description);
    }

    if (!this.utility.IsNullOrEmpty(_editions.controls[1].value.image)) {
      formData.append('secondImage', _editions.controls[1].value.image);
      formData.append('secondImageName', _editions.controls[1].value.name);
      formData.append('secondImageDescription', _editions.controls[1].value.description);
    }

    if (!this.utility.IsNullOrEmpty(_editions.controls[2].value.image)) {
      formData.append('thirdImage', _editions.controls[2].value.image);
      formData.append('thirdImageName', _editions.controls[2].value.name);
      formData.append('thirdImageDescription', _editions.controls[2].value.description);
    }


    this.authStore.ArtistSignup(formData).subscribe(res => {
      this.loading = false;
      if (res["result"] === "successful") {
        this.sendApplicationEmail(newArtist.name, newArtist.email, res["data"]);
        this.dialogSrv.infoThis("You have successfully registered ",
          () => {
            this.router.navigate(['./checkStatus'], {});
          }, () => {
            console.log("yed ===");
          });
      }
    }, error => {
      this.loading = false;
      console.error("signup failed!", error);
      this.dialogSrv.infoThis("Signup failed! Please inform us if you still cannot submit . ",
        () => {

        }, () => {
        });
    });

  }

  sendApplicationEmail(name, email, uid) {

    let url = '/checkStatus';
    let link = window.location.origin + url;
    this.EmailSrv.sendApplicationEmail("We have received your application.",
      name, email, link, uid).subscribe(res => {
        if (res['result'] == 'successful') {
          console.log("Email sent");
        } else {
          console.error("sendApplicationEmail failed." + res['message']);
        }

      }, error => {

        console.error("sendApplicationEmail failed." + error);
      })

  }
  test() {
    this.dialogSrv.infoThis(this.verifiedMsg,
      () => {
        console.log("yed ===");
      }, () => {
        console.log("no ===");
      });
  }
}
