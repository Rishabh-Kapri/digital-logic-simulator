import { Component, Input, Node } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { ReteService } from 'src/app/core/rete.service';
import { SinkControl } from '../controls/sink-control/sink.control';
import { IOCustomNodeComponent } from '../nodes/io-custom-node/io-custom-node.component';
import { ioSocket } from '../sockets/sockets';

export class SinkComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Sink';
  constructor(public _rete: ReteService) {
    super('Sink');
    this.data.render = 'angular';
    this.data.component = IOCustomNodeComponent;
  }

  async builder(node: Node) {
    const input = new Input('input', '', ioSocket);

    input.addControl(new SinkControl(this.editor, 'input'));
    node.addControl(new SinkControl(this.editor, `${this.key}-${node.data['id']}`)).addInput(input);
  }

  async worker(node: NodeData, inputs: WorkerInputs, _: WorkerOutputs, args: any) {
    console.log('Sink Component:', node, inputs['input'], args);
    const input = <boolean>(inputs['input'].length ? inputs['input'][0] : false);
    if (args['readWrite'] && args['circuitName']) {
      // if this is a module sink, set the output value in class instance
      this._rete.setCircuitOutput(<string>args['circuitName'], 'output', input);
    }
    const key = `${this.key}-${node.data['id']}`;
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
    if (currNode) {
      const ctrl = <SinkControl>currNode?.controls.get(key);
      ctrl.setSinkValue(input);
    }
  }
}
