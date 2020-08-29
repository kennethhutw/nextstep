import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutPrivateKeyComponent } from './without-private-key.component';

describe('WithoutPrivateKeyComponent', () => {
  let component: WithoutPrivateKeyComponent;
  let fixture: ComponentFixture<WithoutPrivateKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithoutPrivateKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutPrivateKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
