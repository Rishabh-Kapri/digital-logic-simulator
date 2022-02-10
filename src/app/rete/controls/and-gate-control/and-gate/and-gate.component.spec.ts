import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndGateComponent } from './and-gate.component';

describe('AndGateComponent', () => {
  let component: AndGateComponent;
  let fixture: ComponentFixture<AndGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AndGateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AndGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
