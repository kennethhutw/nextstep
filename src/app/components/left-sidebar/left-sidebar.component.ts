import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: [
    './left-sidebar.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LeftSidebarComponent implements OnInit {

  @Input() sidebarId: string;
  @ViewChild('footerContent') footerContent;
  @ViewChild('headerContent') headerContent;
  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    // we added this so that when the backdrop is clicked the modal is closed.
    this.el.nativeElement.addEventListener('click', () => {
      this.close();
    });
  }

  close() {
    this.el.nativeElement.classList.remove('sshow');
    this.el.nativeElement.classList.add('hhidden');
  }

  open() {

    this.el.nativeElement.classList.add('sshow');
  }


}
