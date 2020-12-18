import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CollectorFavoriteComponent } from "./collector-favorite.component";

describe("CollectorFavoriteComponent", () => {
  let component: CollectorFavoriteComponent;
  let fixture: ComponentFixture<CollectorFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectorFavoriteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
