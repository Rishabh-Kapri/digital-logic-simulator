import { Store } from '@ngxs/store';
import { Component, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { AppActions } from 'src/app/core/store/actions/app.actions';
import { SourceControl } from '../controls/source-control/source.control';
import { IOCustomNodeComponent } from '../nodes/io-custom-node/io-custom-node.component';
import { ioSocket } from '../sockets/sockets';

export class SourceComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Source';
  constructor(private store: Store) {
    super('Source');
    this.data.render = 'angular';
    this.data.component = IOCustomNodeComponent;
  }

  async builder(node: Node) {
    const out = new Output('data_output', '', ioSocket);

    node.addControl(new SourceControl(this.editor, `${this.key}-${node.data['id']}`)).addOutput(out);
  }

  async worker(node: NodeData, _: WorkerInputs, outputs: WorkerOutputs, args: any) {
    const key = `${this.key}-${node.data['id']}`;

    if (args?.['isInternal'] && args?.['circuitName']) {
      // Internal source is triggered
      // when readWrite is true this source acts as input for circuit module
      // key is generated using the name-id of the source in NodesData
      // this is done so that the key can be passed here when there is multiple inputs
      // because the worker doesn't know if this is input 0, 1, ...
      // if we want to use data_input_0 etc as key then we need to pass the index of the input
      //
      // Received by inputs of circuit module and then converted to outputs of
      // internal source
      // we get the input value received from external source and save it in a key value pair
      // ourside-source --> provides input to circuit socket --> circuit stores values
      // --> internal circuit module gates use this input from the outputs of the source
      //
      //
      //                              |
      // (output of)   (inputs of cm) |
      // source-0 ----> cm-source-0 ---> outputs of cm-source-0 --> passed to interval gates
      //                              |
      //                              |
      const circuitName = <string>args?.['circuitName'];
      outputs['data_output'] =
        <boolean>this.store.selectSnapshot((state) => state.circuit[circuitName]?.inputValues[key]?.[0]) ?? false;
    } else {
      // External source is triggered
      const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
      const output = node.data[key];
      outputs['data_output'] = output;
      if (currNode) {
        currNode.meta = { output }; // set value of output in meta object of node for later access
        const connections = this.editor?.view.connections;
        const nodeConnections = currNode?.getConnections() ?? [];
        this.store.dispatch(new AppActions.UpdateConnectionStroke(connections, nodeConnections));
      }
    }
  }
}
