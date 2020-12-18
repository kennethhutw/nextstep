import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorProfilePageComponent } from "./collectorProfile.component";

describe("CollectorProfilePageComponent", () => {
  let component: CollectorProfilePageComponent;
  let fixture: ComponentFixture<CollectorProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorProfilePageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
