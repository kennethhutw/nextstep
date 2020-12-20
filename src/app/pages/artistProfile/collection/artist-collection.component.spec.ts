import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistCollectionComponent } from "./artist-collection.component";

describe("ArtistCollectionComponent", () => {
  let component: ArtistCollectionComponent;
  let fixture: ComponentFixture<ArtistCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistCollectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
