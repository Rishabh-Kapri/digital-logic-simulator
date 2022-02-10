import { Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { SourceComponent } from './source/source.component';

export class SourceControl extends Control implements AngularControl {
  component!: Type<SourceComponent>;
  props!: { [key: string]: unknown };

  constructor(public emitter: any, key: string, show = true) {
    super(key);
    this.component = SourceComponent;
    this.props = {
      show,
      sourceValue: false,
      sourceValChange: (v: boolean) => this.onSourceValChange(v),
      mounted: () => {
        this.setSourceValue((this.getData(key) as any) || false);
      },
    };
  }

  onSourceValChange(val: boolean) {
    this.setSourceValue(val);
    this.emitter.trigger('process');
  }

  setSourceValue(val: boolean) {
    this.props['sourceValue'] = val;
    this.putData(this.key, this.props['sourceValue']);
  }
}
