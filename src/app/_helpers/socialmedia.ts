
import { Injectable } from '@angular/core';

@Injectable()
export class SocialMediaUtility {


    constructor(
    ) {
    }

    getLinkedInPersonalURL() {
        return 'https://www.linkedin.com/in/';
    }
    getLinkedInCompanyURL() {
        return 'https://www.linkedin.com/company/';
    }

    getTwitterURL() {
        return 'https://twitter.com/';
    }

    getFBURL() {
        return 'https://www.facebook.com/';
    }

    getIGURL() {
        return 'https://www.instagram.com/';
    }

    getGitHubURL() {
        return 'https://github.com/';
    }
}
