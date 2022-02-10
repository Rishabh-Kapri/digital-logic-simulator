import { Component, Input, Node, Output } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { ReteService } from 'src/app/core/rete.service';
import { SourceControl } from '../controls/source-control/source.control';
import { IOCustomNodeComponent } from '../nodes/io-custom-node/io-custom-node.component';
import { ioSocket } from '../sockets/sockets';

export class SourceComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  key = 'Source';
  constructor(private _rete: ReteService) {
    super('Source');
    this.data.render = 'angular';
    this.data.component = IOCustomNodeComponent;
  }

  async builder(node: Node) {
    const input = new Input('input', '', ioSocket);
    const out = new Output('output', '', ioSocket);

    input.addControl(new SourceControl(this.editor, 'input'));
    node.addControl(new SourceControl(this.editor, `${this.key}-${node.data['id']}`)).addOutput(out);
  }

  async worker(node: NodeData, _: WorkerInputs, outputs: WorkerOutputs, args: any) {
    console.log('Source Component:', node, 'Outputs:', outputs, args);
    const key = `${this.key}-${node.data['id']}`;
    const output = node.data[key];
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);

    if (args['readWrite'] && args['circuitName']) {
      // if this is a module source, set the input value in class instance
      // @TODO
      // call the set method
      // this._rete.setCircuitOutput(<string>args['circuitName'], 'output', outputs);
    }

    outputs['output'] = output;
    if (currNode) {
      currNode.meta = { output }; // set value of output in meta object of node for later access
      const connections = this.editor?.view.connections;
      const nodeConnections = currNode?.getConnections() ?? [];
      this._rete.updateConnectionStroke(connections, nodeConnections);
    }
  }
}

// source-0 true
// source-1 false
