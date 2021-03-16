export class NewArtist {
    id: string;
    name: string;
    uid: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    blog: string;
    tags: string;
    editions: ApplyEdition[]
}

export class ApplyEdition {
    name: string;
    description: string;
    imageName: string;
    imageUrl: string;
    imageSize: number;
}

export class UserModel {
    constructor() { }
    id: string;
    name: string;
    uid: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    facebook: string;
    twitter: string;
    instagram: string;
    blog: string;
    tags: string;
    roles: any;
}
