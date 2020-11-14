import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,
   FormGroup,
    Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_guards/auth.service';
import { Utility} from '../../_helpers';
import { ViewCompileResult } from '@angular/compiler/src/view_compiler/view_compiler';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})

export class LogInComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  InvalidUser = false;
  unverifiedUser = false;
  message: string = "";

  constructor(
    private utility: Utility,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private AuthService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.InvalidUser = false;
    if (this.loginForm.invalid) {
      return;
    }

    let password =this.loginForm.value.password;
    if(this.utility.IsNullOrEmpty(password)){
     let  pass = bcrypt.hashSync(password, 10);
    }
    // var res = this.AuthService.login(this.loginForm.value.email, this.loginForm.value.password)
    // // console.log(res);

    // res.subscribe(result => {
    //   // console.log("result", result);
    //   if (result["data"] == undefined) {
    //     this.InvalidUser = true;
    //   } else {
    //     localStorage.setItem("id", result["data"]["id"]);
    //     this.router.navigate(['/userpage']);
    //   }
    // });



  }

}
