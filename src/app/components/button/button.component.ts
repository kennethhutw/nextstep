import { 
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation 
} from '@angular/core';

@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() text: string;
  @Input() tip?: string;
  @Input() class?: string;
  @Input() role?: string;
  @Input() label?: string;
  @Input() selected?: boolean;
  @Input() tabindex?: string;
  @Input() index?: number;
  @Input() active?: boolean;
  @Input() disabled: boolean;
  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // https://stackoverflow.com/questions/42111971/why-click-function-triggers-twice-for-custom-component-in-angular-2
  onClick( event: any) {
    // event.preventDefault();
    // this.click.emit(event);
  }

}
