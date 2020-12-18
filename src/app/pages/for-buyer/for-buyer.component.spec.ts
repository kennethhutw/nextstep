import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForBuyerComponent } from './for-buyer.component';

describe('ForBuyerComponent', () => {
  let component: ForBuyerComponent;
  let fixture: ComponentFixture<ForBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
