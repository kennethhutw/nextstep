import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Edition3Component } from "./edition3.component";

describe("Edition3Component", () => {
  let component: Edition3Component;
  let fixture: ComponentFixture<Edition3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Edition3Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edition3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
