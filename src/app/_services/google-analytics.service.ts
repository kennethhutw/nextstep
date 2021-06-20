import { Injectable } from '@angular/core';

declare let gtag: Function; // Declare ga as a function

@Injectable()
export class GoogleAnalyticsService {

  constructor() { }


  //create our event emitter to send our data to Google Analytics
  public eventEmitter(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    if (typeof gtag !== 'undefined')
      gtag('send', 'event', {
        eventCategory: eventCategory,
        eventLabel: eventLabel,
        eventAction: eventAction,
        eventValue: eventValue
      });
  }

}
