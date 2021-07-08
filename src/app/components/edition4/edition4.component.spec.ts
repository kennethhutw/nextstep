import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Edition4Component } from "./edition4.component";

describe("Edition4Component", () => {
  let component: Edition4Component;
  let fixture: ComponentFixture<Edition4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Edition4Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edition4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
