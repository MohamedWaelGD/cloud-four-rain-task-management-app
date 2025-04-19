import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFormTextComponent } from './error-form-text.component';

describe('ErrorFormTextComponent', () => {
  let component: ErrorFormTextComponent;
  let fixture: ComponentFixture<ErrorFormTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorFormTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorFormTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
