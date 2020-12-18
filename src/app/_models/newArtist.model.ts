export class NewArtist{
    name:string;
    email:string;
    location:string;
    website:string;
    facebook:string;
    twitter:string;
    instagram:string;
    blog:string;
    editions:ApplyEdition[]
}

export class ApplyEdition{
    name:string;
    description:string;
    imageName:string;
    imageUrl:string;
    imageSize:number;
}
