import { Component, ViewEncapsulation, Input } from "@angular/core";

@Component({
  selector: "ui-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TagComponent {
  @Input() class: string;
  @Input() tag: string;


  constructor(
  ) {

  }

  ngOnInit() {

  }

}
