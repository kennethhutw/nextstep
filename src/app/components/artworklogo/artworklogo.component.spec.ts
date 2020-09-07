import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtWorkLogoComponent } from './artworklogo.component';

describe('ArtWorkLogoComponent', () => {
  let component: ArtWorkLogoComponent;
  let fixture: ComponentFixture<ArtWorkLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtWorkLogoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtWorkLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
