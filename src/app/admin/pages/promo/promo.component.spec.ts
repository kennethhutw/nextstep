import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPromoComponent } from './promo.component';

describe('AdminPromoComponent', () => {
  let component: AdminPromoComponent;
  let fixture: ComponentFixture<AdminPromoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPromoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
