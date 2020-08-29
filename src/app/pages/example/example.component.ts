import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  title = "owlcarouselinAngular";
  Images = [
    "../assets/img/slider/1.jpg",
    "../assets/img/slider/2.jpg",
    "../assets/img/slider/3.jpg",
  ];

  SlideOptions = { items: 1, dots: true, nav: true };
  CarouselOptions = { items: 3, dots: true, nav: true };
  constructor() { }

  ngOnInit() {
  }

}
