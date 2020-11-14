import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { newEditionComponent } from './newEdition.component';

describe('newEditionComponent', () => {
  let component: newEditionComponent;
  let fixture: ComponentFixture<newEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [newEditionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(newEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
