import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AppSettingsService {
  /*   CountryOptions: [];*/
  constructor(private http: HttpClient) {}

  public getCountryOptions(): Observable<any> {
    return this.http.get("./../../assets/data/countries.json");
  }
  public getTagOptions(lang): Observable<any> {
    console.log("=======================", lang);
    return this.http.get(`./../../assets/data/types_${lang}.json`);
  }
}
