import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Edition2Component } from "./edition2.component";

describe("Edition2Component", () => {
  let component: Edition2Component;
  let fixture: ComponentFixture<Edition2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Edition2Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edition2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
