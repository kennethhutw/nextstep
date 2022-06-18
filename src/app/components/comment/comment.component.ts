import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentComponent implements OnInit {
  @Input() name: string;
  @Input() timestamp: string;
  @Input() private: boolean;
  @Input() text: string;
  @Input() avatar?: string;

  @ViewChild('comment') commentRef: ElementRef;

  isExpanded: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    console.log('call dialog');
  }

  onExpand() {
    this.commentRef.nativeElement.innerText = this.text;
    this.isExpanded = !this.isExpanded;
  }

}
