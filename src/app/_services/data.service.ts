import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DataService {
     isSidebarPinned = false;
  isSidebarToggeled = false;

    private lang = new BehaviorSubject('');
    langKey = this.lang.asObservable();

    constructor(
    ) {
    }

    setLang(lang){
        this.lang.next(lang);
    }

     toggleSidebar() {
    this.isSidebarToggeled = ! this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = ! this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

}
