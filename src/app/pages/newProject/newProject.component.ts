import { HostListener, HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DialogService } from './../../_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var $: any; // ADD THIS


@Component({
  selector: 'app-new-project',
  templateUrl: './newProject.component.html',
  styleUrls: ['./newProject.component.css']
})
export class newProjectComponent implements OnInit {

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
