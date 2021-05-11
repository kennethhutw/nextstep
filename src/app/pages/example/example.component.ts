import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DialogService } from './../../_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var $: any; // ADD THIS


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
  currentLogo: any;
  uploadImages = [3];
  imageDrop: any;
  imageDrop1: any;
  imageDrop2: any;
  edition = [];
  newArtistForm: FormGroup;
  submitted = false;
  SlideOptions = { items: 1, dots: true, nav: true };
  CarouselOptions = { items: 3, dots: true, nav: true };
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private dialogSrv: DialogService) {
  }

  ngOnInit() {
    $('[data-toggle="popover"]').popover();


  }

  try() {
    this.dialogSrv.confirmThis("you have successfully registered ",
      () => {
        console.log("yed ===");
      }, () => {
        console.log("No ----");
      });
  }

}
