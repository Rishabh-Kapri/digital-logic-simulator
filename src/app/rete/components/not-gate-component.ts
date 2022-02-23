import { Store } from '@ngxs/store';
import { Component, Input, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { AppActions } from 'src/app/core/store/actions/app.actions';
import { NotGateControl } from '../controls/not-gate-control/not-gate.control';
import { SourceControl } from '../controls/source-control/source.control';
import { GateCustomNodeComponent } from '../nodes/gate-custom-node/node.component';
import { ioSocket } from '../sockets/sockets';

export class NotGateComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Not';
  constructor(private store: Store) {
    super('Not');
    this.data.render = 'angular';
    this.data.component = GateCustomNodeComponent;
  }

  async builder(node: Node): Promise<void> {
    const output = new Output('data_output', '', ioSocket);
    const input = new Input('data_input_0', '', ioSocket);

    input.addControl(new SourceControl(this.editor, 'data_input_0'));

    node
      .addInput(input)
      .addControl(new NotGateControl(this.editor, `${this.key}-${node.data['id']}`))
      .addOutput(output);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, args: any): Promise<void> {
    const key = `${this.key}-${node.data['id']}`;
    const input = (inputs['data_input_0'].length ? inputs['data_input_0'][0] : false) as boolean;

    const output = !input;

    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
    const ctrl = <NotGateControl>currNode?.controls.get(key);

    outputs['data_output'] = output;
    if (!args?.['isInternal']) {
      // only write to control when it is an external gate
      if (currNode) {
        ctrl.setNotValue(output);
        currNode.meta = { output }; // set value of output in meta object of node for later access
        const nodeConnections = currNode.getConnections() ?? [];
        const connections = this.editor?.view.connections;
        this.store.dispatch(new AppActions.UpdateConnectionStroke(connections, nodeConnections));
      }
    } else {
    }
  }
}
