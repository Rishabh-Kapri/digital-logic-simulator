import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrGateComponent } from './or-gate.component';

describe('OrGateComponent', () => {
  let component: OrGateComponent;
  let fixture: ComponentFixture<OrGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrGateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
