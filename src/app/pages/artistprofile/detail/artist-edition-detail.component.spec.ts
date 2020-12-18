import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistEditionDetailComponent } from "./artist-edition-detail.component";

describe("ArtistEditionDetailComponent", () => {
  let component: ArtistEditionDetailComponent;
  let fixture: ComponentFixture<ArtistEditionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistEditionDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistEditionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
