import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistSalesComponent } from "./artist-sales.component";

describe("ArtistSalesComponent", () => {
  let component: ArtistSalesComponent;
  let fixture: ComponentFixture<ArtistSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistSalesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
