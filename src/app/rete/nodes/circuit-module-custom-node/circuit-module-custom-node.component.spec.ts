import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitModuleCustomNodeComponent } from './circuit-module-custom-node.component';

describe('CircuitModuleCustomNodeComponent', () => {
  let component: CircuitModuleCustomNodeComponent;
  let fixture: ComponentFixture<CircuitModuleCustomNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircuitModuleCustomNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircuitModuleCustomNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
