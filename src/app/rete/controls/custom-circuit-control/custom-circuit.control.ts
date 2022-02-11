import { Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { CustomCircuitComponent } from './custom-circuit/custom-circuit.component';

export class CustomCircuitControl extends Control implements AngularControl {
  component!: Type<CustomCircuitComponent>;
  props!: { [key: string]: unknown };

  constructor(public emitter: any, key: string) {
    super(key);
    this.component = CustomCircuitComponent;
    this.props = {
      circuitName: '',
      setCircuitName: (v: string) => this.setCircuitName(v),
      mounted: () => {
        // this.setCircuitName((this.getData(key) as any) || '');
      },
    };
  }

  setCircuitName(name: string) {
    this.props['circuitName'] = name;
    this.emitter.trigger('process');
  }
}
