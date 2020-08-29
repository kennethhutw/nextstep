import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAddressComponent } from './importAddress.component';

describe('ImportAddressComponent', () => {
  let component: ImportAddressComponent;
  let fixture: ComponentFixture<ImportAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportAddressComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
