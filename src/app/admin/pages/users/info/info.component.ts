import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  UserService,
  AuthStore,
  ToastService,
  EmailService,
  PendingEditionService,
  ArtistService,
  AppSettingsService
} from '../../../../_services';
import { TranslateService } from "@ngx-translate/core";
import { Utility } from "src/app/_helpers";
import {

  ActivatedRoute
} from "@angular/router";
import {
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { NewArtist } from "./../../../../_models";

import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-user-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  editedUser: any;
  editions: any = [];
  currentUser: any;

  profileImage: any;
  profileImageFile: any;

  profileForm: FormGroup;
  IsUpdateFailed = false;
  informMsg = null;

  countriesOptions: any;
  constructor(
    private appSettingsSrv: AppSettingsService,
    private translateSrv: TranslateService,
    private artistSrv: ArtistService,
    private authStoreSrv: AuthStore,
    private pendingEditionSrv: PendingEditionService,
    private emailSrv: EmailService,
    private toastSrv: ToastService,
    private route: ActivatedRoute,
    private authSrv: AuthStore,
    private formBuilder: FormBuilder,
    private userSrv: UserService,
    private utility: Utility,
  ) { }

  ngOnInit() {
    this.currentUser = this.authStoreSrv.getUserData();
    // this.toastSrv.showToast('Success', "Sent", this.toastSrv.iconClasses.success);
    // this.toastr.success('Hello world!', 'Toastr fun!');
    this.route.params.subscribe(params => {
      const _uid = params["id"];
      this.userSrv.getUserBasicInfo(_uid).then(res => {

        if (res["result"] === "successful") {
          this.editedUser = res["data"];
          if (!!this.editedUser) {
            this.initArtworks(this.editedUser.id);

            let _location = this.editedUser.country;
            if (this.utility.IsNullOrEmpty(_location)) {
              _location = "";
            }
            this.profileForm.setValue({
              name: this.editedUser.name,
              bio: this.editedUser.bio,
              location: _location,
              website: this.editedUser.website,
              facebook: this.editedUser.facebook,
              twitter: this.editedUser.twitter,
              instagram: this.editedUser.instagram,
              tags: this.editedUser.tags
            });
            if (!this.utility.IsNullOrEmpty(this.editedUser.imageUrl)) {
              this.profileImage = environment.assetUrl + this.editedUser.imageUrl;
            }
          }

          //tags: "bizarre,love,romantic"
        } else {

        }
      }
      ).catch(error => {
        console.error(` get data error ${error}`);
      });

    })

    this.profileForm = this.formBuilder.group({
      name: [""],
      bio: [""],
      location: [""],
      website: [""],
      facebook: [""],
      twitter: [""],
      instagram: [""],
      tags: [""]
    });
    this.appSettingsSrv.getCountryOptions().subscribe(data => {
      this.countriesOptions = data;
    });
  }

  ngAfterViewInit(): void {

  }
  onRemoveImg(event) {
    this.profileImage = null;
    this.profileImageFile = null;
  }

  onDetectImage(event) {
    if (event.target.files.length === 0)
      return;

    var mimeType = event.target.files[0].type;
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

  CheckStatus(value) {
    let _status = "not decide";
    switch (value) {
      case "1":
        _status = "approved";
        break;
      case 2:
        _status = "rejected";
        break;

    }
    return _status;
  }

  ngOnDestroy(): void {

  }

  initArtworks(uid) {
    try {
      this.pendingEditionSrv.getPendingEdition(uid).subscribe(res => {
        console.log(` getPendingEdition ${res}`, res);
        if (res['result'] == 'successful') {
          this.editions = res['data'];
          if (this.editions.length > 0) {
            this.editions.forEach((element) => {
              element.imageUrl = environment.assetUrl + element.imageUrl;
            });
          }
        }
      }, error => {
        console.error(` get PendingEdition : ${error} `);

      })
    } catch (error) {

    }
  }

  // 0: not decide ,1: approve, 2:reject;
  setApprove(value) {
    try {
      this.pendingEditionSrv.updatePendingEdition(this.editedUser.id,
        this.currentUser.id, value).subscribe(_res => {
          if (_res["result"] === 'successful') {
            let _status = 'Approved';
            if (!value)
              _status = 'Rejected';
            if (value) {
              this.editedUser.approved = true;
            }
            this.toastSrv.showToast('Success', _status, this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('Failed', _res['message'], this.toastSrv.iconClasses.error);
          }
        }, error => {
          console.error(`setApprove failed `, error);
          this.toastSrv.showToast('Failed', error.message, this.toastSrv.iconClasses.error);
        });
    }
    catch (err) {
      console.error(`setApprove failed `, err);
    }
  }

  sendRejectEmail() {
    try {
      let domain = window.location.origin;
      let url = '/setPassword';
      let link = domain + url;
      this.emailSrv.sendrejectedEmail(
        'FormosArt Artist application result',
        this.editedUser.name,
        this.editedUser.email,
        link,
        this.currentUser.id).subscribe(sendRes => {
          if (sendRes['result'] == 'successful') {
            this.toastSrv.showToast('Success', "Reject Email Sent", this.toastSrv.iconClasses.success);
          } else {
            this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
          }
          // this.msg = true;
          // this.message = 'E-mail has been sent to reset your password.';
        }, error => {
          this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
        });
    } catch (error) {

    }

  }

  sendApprovedEmail() {
    let domain = window.location.origin;

    let link = domain;
    this.emailSrv.sendapprovedEmail(
      this.editedUser.id,
      'FormosArt Artist Application',
      this.editedUser.name,
      this.editedUser.email,
      link,
      this.currentUser.id).subscribe(sendRes => {
        if (sendRes['result'] == 'successful') {
          this.toastSrv.showToast('Success', "Approved Email Sent", this.toastSrv.iconClasses.success);
        } else {
          this.toastSrv.showToast('Failed', sendRes['message'], this.toastSrv.iconClasses.error);
        }
        // this.msg = true;
        // this.message = 'E-mail has been sent to reset your password.';
      }, error => {
        this.toastSrv.showToast('Failed', error, this.toastSrv.iconClasses.error);
      });
  }


  onSubmit() {
    this.informMsg = "";
    this.IsUpdateFailed = false;
    let newArtist = new NewArtist();
    newArtist.name = this.profileForm.value.name;
    newArtist.bio = this.profileForm.value.bio;
    newArtist.location = this.profileForm.value.location;
    newArtist.facebook = this.profileForm.value.facebook;
    newArtist.website = this.profileForm.value.website;
    newArtist.twitter = this.profileForm.value.twitter;
    newArtist.instagram = this.profileForm.value.instagram;
    newArtist.tags = this.profileForm.value.tags;

    let formData = new FormData();
    formData.append("id", this.currentUser.id);
    formData.append("uid", this.currentUser.id);
    formData.append("name", newArtist.name);
    formData.append("bio", newArtist.bio);
    formData.append("facebook", newArtist.facebook);
    formData.append("location", newArtist.location);
    formData.append("website", newArtist.website);
    formData.append("twitter", newArtist.twitter);
    formData.append("instagram", newArtist.instagram);
    formData.append("tags", newArtist.tags);
    formData.append("profileImage", this.profileImageFile);

    this.artistSrv.updateArtistBasicInfo(formData).subscribe(res => {
      if (res["result"] === "successful") {
        this.informMsg = "save successful";
      }
      else {
        this.informMsg = "save failed";
      }
    }, error => {
      this.informMsg = "save failed";
      console.error("update Basic infor failed", error);
    });
  }
}
