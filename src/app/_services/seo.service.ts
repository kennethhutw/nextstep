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
            { name: 'title', content: title + " | FormosArt " },
            { property: 'og:title', content: title + " | FormosArt " },
            { property: 'og:type', content: "article" },
            { property: 'og:description', content: description },
            { property: 'og:image', content: image },
            { property: 'og:image:secure_url', content: image },
            { property: 'og:url', content: url },
            { name: 'description', content: description },
            { name: 'image', content: image },
            { name: 'twitter:title', content: title + " | FormosArt " },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image }];

        console.log(" seo ============= ", metaTags);
        metaTags.forEach(m => this.meta.updateTag(m));

    }
}
