import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorSalesComponent } from "./collector-sales.component";

describe("CollectorSalesComponent", () => {
  let component: CollectorSalesComponent;
  let fixture: ComponentFixture<CollectorSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorSalesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
