import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from './../environments/environment';


@Injectable()
export class UserService {
  fakeUserData = [
    {
      id: '0001',
      name: 'Test01',
      account: 'Test01-Account',
      password: 'Test01',
      email: 'test01@gmail.com'
    },
    {
      id: '0002',
      name: 'Test02',
      account: 'Test02-Account',
      password: 'Test02',
      email: 'test02@gmail.com'
    },
    {
      id: '0003',
      name: 'Test03',
      account: 'Test03-Account',
      password: '0003',
      email: 'test03@gmail.com'
    }
  ];

  constructor(
    private http: HttpClient
  ) { }

  getAllUser() {
    return this.fakeUserData;
  }

  getUserIDByEmail(email: string) {

    for (let i = 0; i < this.fakeUserData.length; i++) {
      const user = this.fakeUserData[i];
      if (user.email == email) {
        return user.id;
      }
    }
  }

  loggedInID: string;
  loggedInEmail: string;

  getLoggedInEmail() {
    return localStorage.getItem("email");
  }

  getLoggedInID(email: string) {
    for (let i = 0; i < this.fakeUserData.length; i++) {
      const user = this.fakeUserData[i];
      if (user.email == email) {
        return user.id;
      }
    }
  }

  login(email: string, password: string) {

    var result = this.http.post(
      'http://cryptopaymentserver.herokuapp.com/user/login',
      {
        "email": email,
        "password": password
      });
    return result

  }
}
