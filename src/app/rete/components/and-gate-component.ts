import { Store } from '@ngxs/store';
import { Component, Input, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { AppActions } from 'src/app/core/store/actions/app.actions';
import { AndGateControl } from '../controls/and-gate-control/and-gate.control';
import { SourceControl } from '../controls/source-control/source.control';
import { GateCustomNodeComponent } from '../nodes/gate-custom-node/node.component';
import { ioSocket } from '../sockets/sockets';

export class AndGateComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'And';
  constructor(private store: Store) {
    super('And');
    this.data.render = 'angular';
    this.data.component = GateCustomNodeComponent;
  }

  async builder(node: Node): Promise<void> {
    const out = new Output('data_output', '', ioSocket);
    const inputA = new Input('data_input_0', '', ioSocket);
    const inputB = new Input('data_input_1', '', ioSocket);

    inputA.addControl(new SourceControl(this.editor, 'data_input_0'));
    inputB.addControl(new SourceControl(this.editor, 'data_input_1'));

    node
      .addInput(inputA)
      .addInput(inputB)
      .addControl(new AndGateControl(this.editor, `${this.key}-${node.data['id']}`))
      .addOutput(out);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, args: any) {
    const key = `${this.key}-${node.data['id']}`;
    const inputA = (inputs['data_input_0'].length ? inputs['data_input_0'][0] : false) as boolean;
    const inputB = (inputs['data_input_1'].length ? inputs['data_input_1'][0] : false) as boolean;

    const output = inputA && inputB;

    outputs['data_output'] = output;
    if (!args?.['isInternal']) {
      const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
      const ctrl = <AndGateControl>currNode?.controls.get(key);
      // only write to control when it is an external gate
      if (currNode) {
        ctrl.setAndValue(output);
        currNode.meta = { data_output: output }; // set value of output in meta object of the node for later access
        const nodeConnections = currNode.getConnections() ?? [];
        const connections = this.editor?.view.connections;
        this.store.dispatch(new AppActions.UpdateConnectionStroke(connections, nodeConnections));
      }
    }
  }
}
