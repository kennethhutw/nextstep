import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'lab-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        right: '0px'
      })),
      state('close', style({
        opacity: 0,
        right: '-50px'
      })),
      transition('open => close', [
        animate('.3s')
      ]),
      transition('close => open', [
        animate('.3s')
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CustomModalComponent implements OnInit {

  @Input() class?: string;
  @Input() open: boolean;
  @Input() viewAll: boolean;
  @Input() allowfullscreen: boolean = false;
  @Input() allowadd: boolean = false;
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() expand = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  // close modal batch list
  onCloseModal(event: any) {
    event.stopPropagation();
    this.close.emit();
  }

  onExpandModal() {
    this.expand.emit();
  }

  onAddModal() {
    this.add.emit();
  }

}
