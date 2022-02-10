import { Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { OrGateComponent } from './or-gate/or-gate.component';

export class OrGateControl extends Control implements AngularControl {
  component!: Type<OrGateComponent>;
  props!: { [key: string]: unknown };

  constructor(public emitter: any, key: string, readonly = false) {
    super(key);
    this.component = OrGateComponent;
    this.props = {
      readonly,
      orValue: false,
      orValueChange: (v: boolean) => this.onOrValChange(v),
      mounted: () => {
        this.setOrValue((this.getData(key) as any) || false);
      },
    };
  }

  onOrValChange(val: boolean) {
    this.setOrValue(val);
    this.emitter.trigger('process');
  }

  setOrValue(val: boolean) {
    this.props['andValue'] = val;
    this.putData(this.key, this.props['andValue']);
  }
}
