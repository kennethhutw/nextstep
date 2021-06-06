import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  isSidebarPinned = false;
  isSidebarToggeled = false;

  private lang = new BehaviorSubject('');
  langKey = this.lang.asObservable();

  private ethprice = new BehaviorSubject(0);
  ethpriceKey = this.ethprice.asObservable();


  private previewBG = new BehaviorSubject('');
  previewBGKey = this.previewBG.asObservable();
  constructor(
  ) {
  }

  setPreviewBG(value: any) {

    this.previewBG.next(value);
  }

  getPreviewBG() {
    return this.previewBG;
  }

  setLang(lang) {
    this.lang.next(lang);
  }

  setETHPrice(price) {
    this.ethprice.next(price);
  }

  toggleSidebar() {
    this.isSidebarToggeled = !this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = !this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

}
