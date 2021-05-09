import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorBasicComponent } from "./collector-basic.component";

describe("CollectorBasicComponent", () => {
  let component: CollectorBasicComponent;
  let fixture: ComponentFixture<CollectorBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorBasicComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
