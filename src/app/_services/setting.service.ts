import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class SettingService {
    defaultProfileLogo: string = '././assets/images/default_profile.png';
    defulatImage: string = '././assets/images/default.png';
    defaultAssetUrl = environment.assetUrl;
    defaultApiUrl = environment.apiUrl;
}
