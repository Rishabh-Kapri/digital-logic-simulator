import { Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { SinkComponent } from './sink/sink.component';

export class SinkControl extends Control implements AngularControl {
  component!: Type<SinkComponent>;
  props!: { [key: string]: unknown };

  constructor(public emitter: any, key: string) {
    super(key);
    this.component = SinkComponent;
    this.props = {
      sinkValue: false,
      sinkValueChange: (v: boolean) => this.onSinkValChange(v),
      mounted: () => {
        this.setSinkValue((this.getData(key) as any) || false);
      },
    };
  }

  onSinkValChange(val: boolean) {
    this.setSinkValue(val);
    this.emitter.trigger('process');
  }

  setSinkValue(val: boolean) {
    this.props['sinkValue'] = val;
    this.putData(this.key, this.props['sinkValue']);
  }
}
