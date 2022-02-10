import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotGateComponent } from './not-gate.component';

describe('NotGateComponent', () => {
  let component: NotGateComponent;
  let fixture: ComponentFixture<NotGateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotGateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
