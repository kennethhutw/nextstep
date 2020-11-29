import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Edition1Component } from "./edition1.component";

describe("Edition1Component", () => {
  let component: Edition1Component;
  let fixture: ComponentFixture<Edition1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Edition1Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edition1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
