import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_guards/auth.service';
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
    console.log('LoginForm', this.loginForm.value);
    /* 
        var result = this.userService.login(this.loginForm.value.email,
          this.loginForm.value.password
        ).subscribe(result => function () {
          localStorage.setItem("email", this.loginForm.value.email);
          this.router.navigate(['/userpage']);
        }, result => this.InvalidUser = true); */

    var res = this.AuthService.login(this.loginForm.value.email, this.loginForm.value.password)
    // console.log(res);

    res.subscribe(result => {
      // console.log("result", result);
      if (result["data"] == undefined) {
        this.InvalidUser = true;
      } else {
        localStorage.setItem("id", result["data"]["id"]);
        this.router.navigate(['/userpage']);
      }
    })

    // if (res["result"]) {
    //   localStorage.setItem("email", "kenneth.hu@hotmail.com");
    // //  this.router.navigate(["/userpage"]);
    // } else {
    //   this.InvalidUser = true;
    // }


    // res.subscribe(result => {

    //   console.log(result]);
    //   if (result.data[0]["id"] == undefined) {
    //     this.InvalidUser = true;
    //   } else {
    //     localStorage.setItem("email", "kenneth.hu@hotmail.com");
    //     console.log('help');
    //     this.router.navigate["/userpage"];
    //     console.log('help22');

    //   }

    // })

  }

}
