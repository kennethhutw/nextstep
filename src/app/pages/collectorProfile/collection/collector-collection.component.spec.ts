import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorCollectionComponent } from "./collector-collection.component";

describe("CollectorCollectionComponent", () => {
  let component: CollectorCollectionComponent;
  let fixture: ComponentFixture<CollectorCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorCollectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
