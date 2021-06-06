import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewHomeComponent } from './home.component';

describe('PreviewHomeComponent', () => {
  let component: PreviewHomeComponent;
  let fixture: ComponentFixture<PreviewHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewHomeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
