import { Injectable } from "@angular/core";

@Injectable()
export class TimeUtility {

  currentUnixTime = new Date();
  constructor() {}


  getCurrentUnixTimeString() {
    return this.currentUnixTime.getTime().toString();
  }
  getCurrentUnixTime() {
    return this.currentUnixTime.getTime();
  }

   convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

}
