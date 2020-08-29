import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabComponent } from './subTab.component';

describe('SubTabComponent', () => {
  let component: SubTabComponent;
  let fixture: ComponentFixture<SubTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubTabComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
