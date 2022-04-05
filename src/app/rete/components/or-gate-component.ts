import { Store } from '@ngxs/store';
import { Component, Input, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { AppActions } from 'src/app/core/store/actions/app.actions';
import { OrGateControl } from '../controls/or-gate-control/or-gate.control';
import { SourceControl } from '../controls/source-control/source.control';
import { GateCustomNodeComponent } from '../nodes/gate-custom-node/node.component';
import { ioSocket } from '../sockets/sockets';

export class OrGateComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Or';
  constructor(private store: Store) {
    super('Or');
    this.data.render = 'angular';
    this.data.component = GateCustomNodeComponent;
  }

  async builder(node: Node): Promise<void> {
    const out = new Output('data_output', '', ioSocket);
    const inputA = new Input('data_input_0', '', ioSocket);
    const inputB = new Input('data_input_1', '', ioSocket);

    inputA.addControl(new SourceControl(this.editor, 'data_input_0'));
    inputB.addControl(new SourceControl(this.editor, 'data_input_1'));

    node.addInput(inputA).addInput(inputB).addControl(new OrGateControl(this.editor, this.key)).addOutput(out);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, args: any) {
    const inputA = (inputs['data_input_0'].length ? inputs['data_input_0'][0] : false) as boolean;
    const inputB = (inputs['data_input_1'].length ? inputs['data_input_1'][0] : false) as boolean;

    const output = inputA || inputB;

    outputs['data_output'] = output;
    if (!args?.['isInternal']) {
      // only write to control when it is an external gate
      const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
      const ctrl = <OrGateControl>currNode?.controls.get(this.key);
      if (currNode) {
        ctrl.setOrValue(output);
        currNode.meta = { data_output: output }; // set value of output in meta object of the node for later access
        const nodeConnections = currNode.getConnections() ?? [];
        const connections = this.editor?.view.connections;
        this.store.dispatch(new AppActions.UpdateConnectionStroke(connections, nodeConnections));
      }
    }
  }
}
