import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForArtistComponent } from './for-artist.component';

describe('ForArtistComponent', () => {
  let component: ForArtistComponent;
  let fixture: ComponentFixture<ForArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
