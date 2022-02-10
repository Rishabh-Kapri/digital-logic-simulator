import { Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { AndGateComponent } from './and-gate/and-gate.component';

export class AndGateControl extends Control implements AngularControl {
  component!: Type<AndGateComponent>;
  props!: { [key: string]: unknown };

  constructor(public emitter: any, key: string, readonly = false) {
    super(key);
    this.component = AndGateComponent;
    this.props = {
      readonly,
      andValue: false,
      andValueChange: (v: boolean) => this.onAndValChange(v),
      mounted: () => {
        this.setAndValue((this.getData(key) as any) || false);
      },
    };
  }

  onAndValChange(val: boolean) {
    this.setAndValue(val);
    this.emitter.trigger('process');
  }

  setAndValue(val: boolean) {
    this.props['andValue'] = val;
    this.putData(this.key, this.props['andValue']);
  }
}
