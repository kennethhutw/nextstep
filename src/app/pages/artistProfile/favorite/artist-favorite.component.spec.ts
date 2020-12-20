import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistFavoriteComponent } from "./artist-favorite.component";

describe("ArtistFavoriteComponent", () => {
  let component: ArtistFavoriteComponent;
  let fixture: ComponentFixture<ArtistFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistFavoriteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
