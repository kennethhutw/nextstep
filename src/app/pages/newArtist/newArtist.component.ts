import { HostListener,HostBinding, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {EditionService} from './../../_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-newArtist',
  templateUrl: './newArtist.component.html',
  styleUrls: ['./newArtist.component.css']
})
export class NewArtistComponent implements OnInit {

  currentLogo:any;
  uploadImages=[3];
  imageDrop:any;
  imageDrop1:any;
  imageDrop2:any;
  edition=[];
  newArtistForm: FormGroup;
  submitted = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private EditionSrv: EditionService) {
   }

  ngOnInit() {

    this.newArtistForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      location: [''],
      website: [''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      blog: ['']
    });
//     this.t.push(this.formBuilder.group({
//       name: [''],
//       description: [''],
//       edition:[File]
//   }));
//   this.t.push(this.formBuilder.group({
//     name: [''],
//     description: [''],
//     edition:[File]
// }));
// this.t.push(this.formBuilder.group({
//   name: [''],
//   description: [''],
//   edition:[File]
// }));


  }
  get f() {
    return this.newArtistForm.controls;
  }
  get t() { return this.f.Editions as FormArray; }

  onSubmitFormData(){

  }
  localError() {
    throw Error("The app component has thrown an error!");
  }

  failingRequest() {
    this.http.get("https://httpstat.us/404?sleep=2000").toPromise();
  }

  successfulRequest() {
    this.http.get("https://httpstat.us/200?sleep=2000").toPromise();
  }
   _handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    let filestring = btoa(binaryString);  // Converting binary string data.
  }

  onFileUploaded(files, index) {

    this.uploadImages[index]=files[0];
    this.currentLogo = files[0];
    //    let reader = new FileReader();
    // reader.onload = this._handleReaderLoaded.bind(this);
    // reader.readAsBinaryString(files[0]);
    this.EditionSrv.uploadEdition(files[0]).subscribe(res => {

      if (res['result'] === 'successful') {
        let editionData = res['data'];
        this.edition.push(editionData);
        if(index ==1){
          this.imageDrop =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[0]));
        } else  if(index ==2){
          this.imageDrop1 =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[0]));
        } else  if(index ==3){
              this.imageDrop2 =  this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[0]));
        }
      };

    });

  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.newArtistForm.reset();
    this.t.reset();
  //  this.t.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.t.reset();
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newArtistForm.invalid) {
        return;
    }

    console.log("this.edition ===========",this.edition);
    // display form values on success
    console.log('SUCCESS!! :-)\n\n' + JSON.stringify(this.newArtistForm.value, null, 4));
}

}
