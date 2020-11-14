export class NewArtist{
    name:string;
    email:string;
    location:string;
    website:string;
    facebook:string;
    twitter:string;
    instagram:number;
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