import { Component, Input, Node } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { CircuitModuleManagerService } from 'src/app/core/circuit-module-manager.service';
import { ReteService } from 'src/app/core/rete.service';
import { SinkControl } from '../controls/sink-control/sink.control';
import { IOCustomNodeComponent } from '../nodes/io-custom-node/io-custom-node.component';
import { ioSocket } from '../sockets/sockets';

export class SinkComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Sink';
  constructor(public _rete: ReteService, private _manager: CircuitModuleManagerService) {
    super('Sink');
    this.data.render = 'angular';
    this.data.component = IOCustomNodeComponent;
  }

  async builder(node: Node) {
    const input = new Input('data_input_0', '', ioSocket);

    input.addControl(new SinkControl(this.editor, 'data_input_0'));
    node.addControl(new SinkControl(this.editor, `${this.key}-${node.data['id']}`)).addInput(input);
  }

  async worker(node: NodeData, inputs: WorkerInputs, _: WorkerOutputs, args: any) {
    // console.log('SINK  :', node, inputs['data_input_0'], args);
    const key = `${this.key}-${node.data['id']}`;
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
    if (args?.['isInternal'] && args?.['circuitName']) {
      // Internal sink is triggered
      // when isInternal is true the this is used as output for the circuit module
      // we set the input value received in the sink in an output object of module using
      // the name-id of the sink as the key which is retrieved from NodesData
      // data_input_0 is harcoded because sink only has 1 input
      //
      // Received by inputs of internal sink, then is converted to outputs of
      // circuit module
      this._manager.setOutputValue(<string>args['circuitName'], key, <boolean>inputs['data_input_0'][0]);
    } else {
      // External sink is triggered
      const input = <boolean>(inputs['data_input_0'].length ? inputs['data_input_0'][0] : false);
      if (currNode) {
        const ctrl = <SinkControl>currNode?.controls.get(key);
        ctrl.setSinkValue(input);
      }
    }
  }
}
