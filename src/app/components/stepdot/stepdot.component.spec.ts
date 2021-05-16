import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StepDotComponent } from "./stepdot.component";

describe("StepDotComponent", () => {
  let component: StepDotComponent;
  let fixture: ComponentFixture<StepDotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepDotComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
