import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistOfferComponent } from "./artist-offer.component";

describe("ArtistOfferComponent", () => {
  let component: ArtistOfferComponent;
  let fixture: ComponentFixture<ArtistOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistOfferComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
