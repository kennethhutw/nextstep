import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, EmailService } from '../../_services';
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
  msg: string = "";
  msg2: string;
  constructor(
    private route: ActivatedRoute,
    private utility: Utility,
    private router: Router,
    private fb: FormBuilder,
    private emailSrv: EmailService
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


    } else {
      this.isAlarm = true;
      this.msg = "This field cannot be empty, please enter a valid email address.";
    }
  }

  onSubmit() {
    this.onEnter();
  }
}
