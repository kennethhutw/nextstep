import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from "@angular/core";



@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() totalPages: number;
  current5page: number[] = [];

  @Output() onPageChange: EventEmitter<{ page: number }> = new EventEmitter<{ page: number }>();
  constructor() { }

  ngOnInit(): void {
    this.current5page = [0, 1, 2, 3, 4, 5];
  }

  isFirstPage() {
    return this.currentPage == 1;
  }

  isLastPage() {
    return this.currentPage == this.totalPages;
  }

  onChangePage(page: number) {
    console.log("component pagechange", page);
    this.currentPage = page;
    this.onPageChange.emit({ page });
  }

}
