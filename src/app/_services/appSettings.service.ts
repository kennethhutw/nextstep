import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService {
  /*   CountryOptions: [];*/
  skills;
  constructor(private http: HttpClient) { }

  public init(): Promise<any> {

    const _skillPromise = new Promise((resolve, reject) => {
      this.http
        .get('./../../assets/data/skills.json')
        .subscribe(response => {
          this.skills = response;

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

  defaultProfileLogo: string = '././assets/images/default_profile.png';
  defulatImage: string = '././assets/images/default.png';
  defaultAssetUrl = environment.assetUrl;
  defaultApiUrl = environment.apiUrl;
}
