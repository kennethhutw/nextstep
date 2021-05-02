import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, EmailService, ArtistService } from '../../_services';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Utility } from "../../_helpers";
@Component({
  selector: 'app-checkStatus',
  templateUrl: './checkStatus.component.html',
  styleUrls: ['./checkStatus.component.css']
})
export class CheckStatusComponent implements OnInit {
  ArtistEmail: string;
  isAlarm: boolean = false;
  signinEmailForm: FormGroup;
  msg: string;
  msg2: string;
  constructor(
    private route: ActivatedRoute,
    private utility: Utility,
    private router: Router,
    private fb: FormBuilder,
    private emailSrv: EmailService,
    private artistSrv: ArtistService
  ) {

  }

  Reset() {
    this.isAlarm = false;
    this.msg = "";
    this.msg2 = "";
  }

  ngOnInit() {


  }


  onEnter() {
    this.Reset();
    if (!this.utility.IsNullOrEmpty(this.ArtistEmail)) {
      this.artistSrv.getArtistBasicInfoByEmail(this.ArtistEmail).subscribe(res => {
        if (res["result"] === "successful") {
          const _artistData = res["data"];

          if (this.utility.IsNullOrEmpty(_artistData.status)) {
            if (_artistData.status == 0) {
              this.msg = "Your application is still under proessing. \n\b ";
              this.msg2 = "We will review your application soon."
            }
            else {
              this.isAlarm = true;
              this.msg = "No status. Please contact us via email !";
            }
          } else if (_artistData.status == 1) {
            this.msg = "Your application is approve.";
            this.msg2 = " Please login Formosart and upload your artwork."
          } else if (_artistData.status == 2) {
            this.isAlarm = true;
            this.msg = "Your application is rejected. ";
            this.msg2 = "Please submit your application again."
          } else {
            this.isAlarm = true;
            this.msg = "No status. Please contact us via email !";
          }
        } else {
          this.isAlarm = true;
          this.msg = res["message"];
        }
      })

    } else {
      this.isAlarm = true;
      this.msg = "This field cannot be empty, please enter a valid email address.";
    }
  }

  onSubmit() {
    this.onEnter();
  }
}
