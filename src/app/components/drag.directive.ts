import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDropFile]'
})
export class DragDropFileDirective {
	
  @Output() onFileDropped = new EventEmitter<any>();
	
  @HostBinding('style.background-color') private background = '#f5fcff'
  @HostBinding('style.opacity') private opacity = '1'
	
  //Dragover listener
  @HostListener('dragover', ['$event']) onDragFileOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgba(218, 241, 231, 0.857)';
    this.opacity = '0.5'
  }
	
  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragFileLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
  }
	
  //Drop listener
  @HostListener('drop', ['$event']) public onDropFile(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }
	
}
