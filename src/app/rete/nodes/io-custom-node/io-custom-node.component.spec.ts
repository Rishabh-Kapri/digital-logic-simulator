import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCustomNodeComponent } from './source-custom-node.component';

describe('SourceCustomNodeComponent', () => {
  let component: SourceCustomNodeComponent;
  let fixture: ComponentFixture<SourceCustomNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceCustomNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceCustomNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
