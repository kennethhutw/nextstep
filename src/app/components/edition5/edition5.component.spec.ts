import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Edition5Component } from "./edition5.component";

describe("Edition5Component", () => {
  let component: Edition5Component;
  let fixture: ComponentFixture<Edition5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Edition5Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edition5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
