import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DataService {

    private lang = new BehaviorSubject('');
    langKey = this.lang.asObservable();

    constructor(
    ) {
    }

    setLang(lang){
        this.lang.next(lang);
    }

}
