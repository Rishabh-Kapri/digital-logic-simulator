import { Component, Input, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { ReteService } from 'src/app/core/rete.service';
import { AndGateControl } from '../controls/and-gate-control/and-gate.control';
import { SourceControl } from '../controls/source-control/source.control';
import { GateCustomNodeComponent } from '../nodes/gate-custom-node/node.component';
import { ioSocket } from '../sockets/sockets';

export class AndGateComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'And';
  constructor(private _rete: ReteService) {
    super('And');
    this.data.render = 'angular';
    this.data.component = GateCustomNodeComponent;
  }

  async builder(node: Node): Promise<void> {
    const out = new Output('output', '', ioSocket);
    const inputA = new Input('inputA', '', ioSocket);
    const inputB = new Input('inputB', '', ioSocket);

    inputA.addControl(new SourceControl(this.editor, 'inputA'));
    inputB.addControl(new SourceControl(this.editor, 'inputB'));

    node
      .addInput(inputA)
      .addInput(inputB)
      .addControl(new AndGateControl(this.editor, `${this.key}-${node.data['id']}`))
      .addOutput(out);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    const key = `${this.key}-${node.data['id']}`;
    const inputA = (inputs['inputA'].length ? inputs['inputA'][0] : node.data['inputA']) as boolean;
    const inputB = (inputs['inputB'].length ? inputs['inputB'][0] : node.data['inputB']) as boolean;
    const output = inputA && inputB;
    const ctrl = <AndGateControl>this.editor?.nodes.find((n) => n.id === node.id)?.controls.get(key);
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);

    ctrl.setAndValue(output);
    outputs['output'] = output;
    currNode.meta = { output }; // set value of output in meta object of the node for later access

    const nodeConnections = currNode.getConnections() ?? [];
    const connections = this.editor?.view.connections;
    this._rete.updateConnectionStroke(connections, nodeConnections);
  }
}
