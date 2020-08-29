import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTabsComponent } from './subTabs.component';

describe('SubTabComponent', () => {
  let component: SubTabsComponent;
  let fixture: ComponentFixture<SubTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubTabsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
