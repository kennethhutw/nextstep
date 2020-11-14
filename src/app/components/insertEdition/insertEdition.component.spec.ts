import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertEditionComponent } from './insertEdition.component';

describe('InsertEditionComponent', () => {
  let component: InsertEditionComponent;
  let fixture: ComponentFixture<InsertEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsertEditionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
