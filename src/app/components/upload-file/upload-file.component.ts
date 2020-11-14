import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  @Input('multiple') multiple=false;
  @Input('index') index=null;
  @Input('maxFileSize') maxFileSize = 10485760;
  @Input('fileType') fileType = 'all';
  @Output() onFileUploaded = new EventEmitter<any>();
  files: any = [];
  showErrorMessage:any = false;
  constructor() { }

  ngOnInit() {
  }

  uploadFile(event) {
    this.showErrorMessage = false;

    if(!this.multiple){
      this.files = [];
    }
    for (let index = 0; index < event.length; index++) {
      const element = event[index];    
      if (element.size < this.maxFileSize) {
        if(this.fileType!=='all'){
          console.log(element.type.includes(this.fileType), element.type
          )
          if(element.type.includes(this.fileType)){
            this.files.push(element);
          } else{
          this.showErrorMessage = 'The file type is invalid';
          }
        } else{
          this.files.push(element);
        }
    } else{
      this.showErrorMessage = 'The file size is too big';
    }  
    const values = {
      index:this.index,
      files:this.files
    }
    this.onFileUploaded.emit(values)
    if(!this.multiple){
      break;
    }
  
  }

}
  deleteAttachment(index) {
    this.files.splice(index, 1)
    this.onFileUploaded.emit(this.files)
  }
}
