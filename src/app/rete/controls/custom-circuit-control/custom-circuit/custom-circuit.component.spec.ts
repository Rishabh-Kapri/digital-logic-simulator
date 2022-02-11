import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCircuitComponent } from './custom-circuit.component';

describe('CustomCircuitComponent', () => {
  let component: CustomCircuitComponent;
  let fixture: ComponentFixture<CustomCircuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCircuitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCircuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
