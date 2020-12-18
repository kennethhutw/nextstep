import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorAccountComponent } from "./collector-account.component";

describe("CollectorAccountComponent", () => {
  let component: CollectorAccountComponent;
  let fixture: ComponentFixture<CollectorAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorAccountComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
