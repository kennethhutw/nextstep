import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDelegateEmailComponent } from './admin-delegate-email.component';

describe('AdminDelegateEmailComponent', () => {
  let component: AdminDelegateEmailComponent;
  let fixture: ComponentFixture<AdminDelegateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDelegateEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDelegateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
