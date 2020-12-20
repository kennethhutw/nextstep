import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistBasicComponent } from "./artist-basic.component";

describe("ArtistBasicComponent", () => {
  let component: ArtistBasicComponent;
  let fixture: ComponentFixture<ArtistBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistBasicComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
