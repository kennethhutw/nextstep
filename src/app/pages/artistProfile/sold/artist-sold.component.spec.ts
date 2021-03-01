import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistSoldArtWorkComponent } from "./artist-sold.component";

describe("ArtistSoldArtWorkComponent", () => {
  let component: ArtistSoldArtWorkComponent;
  let fixture: ComponentFixture<ArtistSoldArtWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistSoldArtWorkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistSoldArtWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
