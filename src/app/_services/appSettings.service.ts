import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService {
  /*   CountryOptions: [];*/
  constructor(private http: HttpClient) { }

  public getCountryOptions(): Observable<any> {
    return this.http.get("./../../assets/data/countries.json");
  }
  public getTagOptions(lang): Observable<any> {
    return this.http.get(`./../../assets/data/types_${lang}.json`);
  }

  defaultProfileLogo: string = '././assets/images/default_profile.png';
  defulatImage: string = '././assets/images/default.png';
  defaultAssetUrl = environment.assetUrl;
  defaultApiUrl = environment.apiUrl;

  // public getArtistStatus(value) {
  //   switch (value){

  //   }

  // }
}
