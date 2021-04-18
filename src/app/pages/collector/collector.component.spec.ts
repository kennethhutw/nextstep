import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorPageComponent } from "./collector.component";

describe("CollectorPageComponent", () => {
  let component: CollectorPageComponent;
  let fixture: ComponentFixture<CollectorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
