import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  DataService,
  AppSettingsService,
  ArtistService,
  AuthStore,
  EditionService,
  DialogService,
  EmailService,
  PromoService
} from "./../../../_services";
import { Utility } from "./../../../_helpers";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  Router,

} from "@angular/router";
@Component({
  selector: "app-artist-upload",
  templateUrl: "./artist-upload.component.html",
  styleUrls: ["./artist-upload.component.css"],
})
export class ArtistUploadComponent implements OnInit {

  artworkImage: any;
  artworkImageFile: any;

  artworkForm: FormGroup;
  loading = false;
  submitted = false;
  IsUpdateFailed = false;
  informMsg = null;
  currentUser: any;
  ethPrice = 0;
  //discard
  ethAmount: Number = 0.00;
  usdAmount: Number = 0.00;
  tags = [];
  isReadonly = true;
  lang = "en";
  maxWordCount = 300;
  wordCount: any;
  words = 300;
  isQuota = false;
  quotaType = "0";
  specialPrice = "5%";


  isUploading = false;
  @ViewChild("text") text: ElementRef;
  constructor(
    private promoSrv: PromoService,
    private emailSrv: EmailService,
    private changeDetectorRef: ChangeDetectorRef,
    private dataSrv: DataService,
    private utility: Utility,
    private artistSrv: ArtistService,
    private editionSrv: EditionService,
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private formBuilder: FormBuilder,
    private authStoreSrv: AuthStore,
    private dialogSrv: DialogService,
    private router: Router) { }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    if (!this.utility.IsNullOrEmpty(localStorage.getItem("ETHPRICE"))) {
      this.ethPrice = Number(localStorage.getItem("ETHPRICE"));
    }

    this.promoSrv.getQuota(this.currentUser.id).subscribe(res => {
      if (res['result'] == 'successful') {
        this.quotaType = res["type"];
        let nQuota = parseFloat(res["data"]);
        if (nQuota > 0) {
          this.isQuota = true;
          if (this.quotaType == "1") {
            this.specialPrice = "10.5%";
          }
        }
      }
    })

    this.artworkForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      IsBid: [false],
      sellingPrice: ["", [Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/), Validators.min(0.06)]],
      paymentway: [0],
      numberOfArtwork: ["", [Validators.required, Validators.min(0), Validators.max(10)]],
      tags: [""]
    });

    this.lang = localStorage.getItem("lang");
    if (!this.utility.IsNullOrEmpty(this.lang)) {
      this.translateSrv.use(this.lang);
      this.initTags(this.lang);
    } else {
      this.lang = "en";
      this.translateSrv.use("en");
      this.initTags("en");
    }
    this.dataSrv.langKey.subscribe((lang) => {
      if (!this.utility.IsNullOrEmpty(lang)) {
        this.lang = lang;
        this.translateSrv.use(lang);
        this.initTags(lang);
      }
    });
  }


  get f() {
    return this.artworkForm.controls;
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

  TotalETHAmount(event) {
    if (!this.utility.IsNullOrEmpty(event.target.value)) {
      let usd = parseFloat(event.target.value);
      this.ethAmount = +(usd / this.ethPrice).toFixed(3);
    }
  }

  TotalUSDAmount(event) {
    if (!this.utility.IsNullOrEmpty(event.target.value)) {
      let eth = parseFloat(event.target.value);
      this.usdAmount = +(eth * this.ethPrice).toFixed(3);
    }
  }

  onDetectImage(event) {
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.artworkImageFile = event.target.files[0];

    this.artworkForm.patchValue({ name: this.artworkImageFile.name });
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.artworkImage = reader.result;
    }
  }

  upload() {
    try {
      this.isUploading = true;
      let sellprice = this.artworkForm.value.sellingPrice
      if (sellprice > 0)
        sellprice = sellprice * 100;
      let formData = new FormData();
      formData.append("artistId", this.currentUser.id);
      formData.append("uid", this.currentUser.id);
      formData.append("name", this.artworkForm.value.name);
      formData.append("description", this.artworkForm.value.description);
      formData.append("tags", this.artworkForm.value.tags);
      formData.append("isBid", this.artworkForm.value.IsBid);
      formData.append("paymentway", this.artworkForm.value.paymentway);
      formData.append("ethprice", sellprice);
      formData.append("totalamount", this.artworkForm.value.numberOfArtwork);
      formData.append("uploadfile", this.artworkImageFile);

      this.editionSrv.createEdition(formData).subscribe(res => {
        if (res["result"] === "successful") {
          this.translateSrv.get("ARTWORTUPLOADSUCC").subscribe((text: string) => {
            this.informMsg = text;
          });
          this.tags
            .map((ch) => {
              ch.selected = false;
            });
          this.informArtist(this.artworkForm.value.name);
          this.artworkForm.reset();
          this.artworkImageFile = null;
          this.artworkImage = null;
          this.router.navigate(['/artist/collection'], {});
        }
        else {
          this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
            this.informMsg = text;
            this.IsUpdateFailed = true;
          });
        }
      }, error => {
        this.translateSrv.get("UPDATEDFAILED").subscribe((text: string) => {
          this.informMsg = text;
          this.IsUpdateFailed = true;
        });
        console.error("update Basic infor failed", error);
      }, () => {
        this.submitted = false;
        this.isUploading = false;
      });
    } catch (error) {
      console.error("upload failed", error);
      this.isUploading = false;
    } finally {

    }
  }


  getConfirmMsg(lang) {
    let msg = "";
    switch (lang) {
      case "en":
        msg = "You will not be able to revise this artwork after you proceed, do you want to continue?";
        break;
      case "zh-tw":
        msg = "您將無法修改此藝術品的信息和價格，\n您要繼續嗎？"
        break;
      case "zh-cn":
        msg = "您将无法修改此艺术品的信息和价格，\n您要继续吗？"
        break;
    }
    return msg;
  }

  getErrorMsg(lang) {
    let msg = "Please fill in all the required fields(*). ";
    switch (lang) {
      // case "en":
      //   msg = "Please fill in all the required fields(*). ";
      //   break;
      case "zh-tw":
        msg = "請填寫所有必填欄位(*)。"
        break;
      case "zh-cn":
        msg = "请填写所有必填栏位(*)。"
        break;
    }
    return msg;
  }
  onSubmit() {
    this.submitted = true;
    this.IsUpdateFailed = false;
    this.informMsg = null;

    if (this.artworkImageFile == null) {
      this.informMsg = this.getErrorMsg(this.lang);
      this.IsUpdateFailed = true;
      this.changeDetectorRef.detectChanges();
      return;
    }

    if (this.artworkForm.invalid) {
      return;
    }

    let msg = "";
    msg = this.getConfirmMsg(this.lang)

    this.dialogSrv.confirmThis(msg,
      () => {
        console.log("YES");

        this.upload();
      }, () => {
        console.log("NO");
        this.submitted = false;
      });

  }

  numbersOnly(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }


  informArtist(artworkName) {
    //let id = this.edition.firstnumber + 1;
    let domain = window.location.origin;
    let url = '/artist/collection';
    let link = domain + url;
    this.emailSrv.sendReceivedArtworkEmail(
      'We have received your artwork for tokenize',
      this.currentUser.name,
      this.currentUser.email,
      link,
      artworkName,
      this.currentUser.id).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {

        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {

      });
  }
  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;

    this.words = this.wordCount ? (this.maxWordCount - this.wordCount.length) : 0;
  }
}
