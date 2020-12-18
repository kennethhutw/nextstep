import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorOfferComponent } from "./collector-offer.component";

describe("CollectorOfferComponent", () => {
  let component: CollectorOfferComponent;
  let fixture: ComponentFixture<CollectorOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorOfferComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
