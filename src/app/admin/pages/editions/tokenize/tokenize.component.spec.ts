import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenizeComponent } from './tokenize.component';

describe('TokenizeComponent', () => {
  let component: TokenizeComponent;
  let fixture: ComponentFixture<TokenizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TokenizeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
