import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  DataService,
  AuthStore,
  DialogService,
  EmailService,
  PromoService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import { NewArtist, ApplyEdition } from "./../../../_models";
import { Router, ActivatedRoute } from '@angular/router';
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
    private promoSrv: PromoService,
    private router: Router,
    private route: ActivatedRoute,
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
      code: [""],
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
    this.route.params.subscribe(params => {
      console.log("pr", params);
      const _code = params["code"];

      this.registerForm.controls['code'].setValue(_code);
    })
  }


  onDetectImage(event, index) {
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {

      return;
    }

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

  async onSubmit() {
    this.loading = true;
    this.message = null;
    this.submitted = true;
    this.theFirstImageNameRequire = false;
    this.theSecodnImageNameRequire = false;
    this.theThirdImageNameRequire = false;
    if (this.registerForm.invalid) {
      this.loading = false;
      this.message = "Name or Email cannot be empty";
      return;
    }

    // let CheckEmailResponse = await this.authStore.IsExistEmail(this.registerForm.value.email);
    // if (!this.utility.IsNullOrEmpty(CheckEmailResponse)) {
    //   if (!this.utility.IsNullOrEmpty(CheckEmailResponse.message)) {
    //     this.loading = false;
    //     this.message = CheckEmailResponse.message;
    //     return;
    //   }
    // }
    /*
        if (!this.utility.IsNullOrEmpty(this.registerForm.value.code)) {
          if (this.registerForm.value.code.indexOf('inv') > -1) {
            let result = await this.promoSrv.checkCode(this.registerForm.value.email, this.registerForm.value.code);
    
            if (result['result'] == 'failed') {
              this.loading = false;
              this.message = "Code or Email does not match.";
              return;
            }
          } else {
            let result = await this.promoSrv.IsExist(this.registerForm.value.code);
    
            if (result['result'] == 'failed') {
              this.loading = false;
              this.message = "Code does not exist.";
              return;
            }
          }
        }
        */


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

    const _emailResult = await this.authStore.checkUserData(newArtist.email, null);
    if (_emailResult["result"] === "successful"
      && _emailResult["email"] !== null) {
      this.message = "Email already exists!";
      this.loading = false;
      return;
    }

    let formData = new FormData();
    formData.append("code", this.registerForm.value.code);
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
        this.submitted = false;
        this.sendApplicationEmail(newArtist.name, newArtist.email, res["data"]);
        this.sendNewUserEmail("new artist signup", "Kenneth", "kenneth@formosart.io", newArtist.name, newArtist.email);
        this.sendNewUserEmail("new artist signup", "Yung Liang", "heyevolet@formosart.io", newArtist.name, newArtist.email);
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

  sendNewUserEmail(subject, receiverName, receiverEmail, userName, userEmail) {
    this.EmailSrv.sendNewUserEmail(subject, receiverName, receiverEmail, userName, userEmail, 'artist').subscribe(res => {
      console.log("sendNewUserEmail", res);
    })
  }

  async IsExistEmail() {
    let userEmail = await this.authStore.IsExistEmail(this.registerForm.value.email);
  }
}
