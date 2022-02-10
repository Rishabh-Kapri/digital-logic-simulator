import { Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { NotGateComponent } from './not-gate/not-gate.component';

export class NotGateControl extends Control implements AngularControl {
  component!: Type<NotGateComponent>;
  props!: { [key: string]: unknown };

  constructor(public emitter: any, key: string, readonly = false) {
    super(key);
    this.component = NotGateComponent;
    this.props = {
      readonly,
      notValue: false,
      notValueChange: (v: boolean) => this.onNotValChange(v),
      mounted: () => {
        this.setNotValue((this.getData(key) as any) || false);
      },
    };
  }

  onNotValChange(val: boolean) {
    this.setNotValue(val);
    this.emitter.trigger('process');
  }

  setNotValue(val: boolean) {
    this.props['notValue'] = val;
    this.putData(this.key, this.props['notValue']);
  }
}
