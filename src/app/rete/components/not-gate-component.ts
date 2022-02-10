import { Component, Input, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { ReteService } from 'src/app/core/rete.service';
import { NotGateControl } from '../controls/not-gate-control/not-gate.control';
import { SourceControl } from '../controls/source-control/source.control';
import { GateCustomNodeComponent } from '../nodes/gate-custom-node/node.component';
import { ioSocket } from '../sockets/sockets';

export class NotGateComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Not';
  constructor(public _rete: ReteService) {
    super('Not');
    this.data.render = 'angular';
    this.data.component = GateCustomNodeComponent;
  }

  async builder(node: Node): Promise<void> {
    const output = new Output('output', '', ioSocket);
    const input = new Input('input', '', ioSocket);

    input.addControl(new SourceControl(this.editor, 'input'));

    node
      .addInput(input)
      .addControl(new NotGateControl(this.editor, `${this.key}-${node.data['id']}`))
      .addOutput(output);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, args: any) {
    console.log('Not Gate Component:', node, 'inputs:', inputs, 'outputs:', outputs, 'args:', args);
    const key = `${this.key}-${node.data['id']}`;
    const input = (inputs['input'].length ? inputs['input'][0] : node.data[key]) as boolean;
    const output = !input;
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
    const ctrl = <NotGateControl>currNode?.controls.get(key);

    outputs['output'] = output;
    if (currNode) {
      ctrl.setNotValue(output);
      currNode.meta = { output }; // set value of output in meta object of node for later access
      const nodeConnections = currNode.getConnections() ?? [];
      const connections = this.editor?.view.connections;
      this._rete.updateConnectionStroke(connections, nodeConnections);
    }
  }
}
