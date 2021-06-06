import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { resResult } from "../_models";

@Injectable()
export class SettingService {
    defaultProfileLogo: string = '././assets/images/default_profile.png';
    defulatImage: string = '././assets/images/default.png';
    defaultAssetUrl = environment.assetUrl;
    defaultApiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getSettings() {
        return this.http.get(`${environment.apiUrl}/settings/getSettings`);
    }

    getSetting(field) {
        return this.http.get(`${environment.apiUrl}/settings/getSetting/` + field);
    }

    getSettingById(id) {
        return this.http.get(`${environment.apiUrl}/settings/getSettingById/` + id);
    }

    insertSettings(field, value, enable, uid) {
        return this.http.post(`${environment.apiUrl}/settings/insertSettings`,
            {
                field,
                value,
                enable,
                uid
            })
    }


    updateSettings(id, field, value, enable, uid) {
        return this.http.post(`${environment.apiUrl}/settings/insertSettings`,
            {
                id,
                field,
                value,
                enable,
                uid
            })
    }


    enableSetting(id, field, enable, uid) {
        return this.http.post(`${environment.apiUrl}/settings/enableSetting`,
            {
                id,
                field,
                enable,
                uid
            })
    }

    public uploadBG(formdata) {
        return this.http
            .post<resResult>(`${environment.apiUrl}/settings/uploadBG`,
                formdata
            );
    }

}
