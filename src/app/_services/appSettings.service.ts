import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService {
  /*   CountryOptions: [];*/
  skills;

  skills_en;
  constructor(private http: HttpClient) { }

  public init(): Promise<any> {

    const _skillPromise = new Promise((resolve, reject) => {
      this.http
        .get('./../../assets/data/skills.json')
        .subscribe(response => {
          this.skills = response;

          resolve(true);
        })

      this.http
        .get('./../../assets/data/skills_en.json')
        .subscribe(response => {
          this.skills_en = response;

          resolve(true);
        })
    });


    return Promise.all([_skillPromise]);

  }
  public getCountryOptions(): Observable<any> {
    return this.http.get("./../../assets/data/countries.json");
  }
  public getTagOptions(lang): Observable<any> {
    return this.http.get(`./../../assets/data/types_${lang}.json`);
  }

  public skillOptions() {
    return this.skills;
  }

  public skillOptionsWithLang(lang) {
    if (lang == "en") {
      return this.skills_en;
    } else {
      return this.skills;
    }
  }

}
