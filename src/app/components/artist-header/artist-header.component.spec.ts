import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistHeaderComponent } from './artist-header.component';

describe('ArtistHeaderComponent', () => {
  let component: ArtistHeaderComponent;
  let fixture: ComponentFixture<ArtistHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
