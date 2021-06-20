import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(private title: Title, private meta: Meta) { }

    updateTitle(title: string) {
        this.title.setTitle(title);
    }

    // updateMetaTags(metaTags: MetaDefinition[]) {
    //     metaTags.forEach(m => this.meta.updateTag(m));
    // }


    updateTag(url, title, description, image) {
        // this.meta.updateTag([
        //     { "data-n-head": "ssr", "data-hid": "og:image", "name": "og:image", content: image },
        //     { "data-n-head": "ssr", "data-hid": "og:image", "name": "twitter:image", content: image },
        //     { "data-n-head": "ssr", "data-hid": "og:description", "name": "og:description", "content": description }
        //     ]
        // );
        let metaTags = [
            { property: 'og:title', content: title + " | FormosArt " },
            { property: 'og:description', content: description },
            { property: 'og:url', content: url },
            { name: 'description', content: description },
            { name: 'image', content: image },
            { name: 'twitter:title', content: title + " | FormosArt " },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image }];


        metaTags.forEach(m => this.meta.updateTag(m));

    }
}
