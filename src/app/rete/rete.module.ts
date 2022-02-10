import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AndGateComponent } from './controls/and-gate-control/and-gate/and-gate.component';
import { ReteComponent } from './rete/rete.component';
import { ReteModule } from 'rete-angular-render-plugin';
import { NotGateComponent } from './controls/not-gate-control/not-gate/not-gate.component';
import { SourceComponent } from './controls/source-control/source/source.component';
import { GateCustomNodeComponent } from './nodes/gate-custom-node/node.component';
import { SinkComponent } from './controls/sink-control/sink/sink.component';
import { OrGateComponent } from './controls/or-gate-control/or-gate/or-gate.component';
import { IOCustomNodeComponent } from './nodes/io-custom-node/io-custom-node.component';

@NgModule({
  declarations: [
    AndGateComponent,
    ReteComponent,
    NotGateComponent,
    GateCustomNodeComponent,
    SourceComponent,
    IOCustomNodeComponent,
    SinkComponent,
    OrGateComponent,
  ],
  imports: [CommonModule, ReteModule],
  exports: [ReteComponent, ReteModule],
  entryComponents: [
    AndGateComponent,
    NotGateComponent,
    GateCustomNodeComponent,
    IOCustomNodeComponent,
    SinkComponent,
    OrGateComponent,
  ],
})
export class ReteEditorModule {}
