import { Component, Node } from 'rete';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { ReteService } from 'src/app/core/rete.service';

export class CircuitModuleComponent extends Component {
  key!: string;

  constructor(name: string, public _rete: ReteService) {
    super(name);
    this.key = name;
  }

  async builder(node: Node) {
    console.log('Circuit module builder:', node);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, args: any) {
    console.log('Module Component:', node, 'Inputs:', inputs, 'Outputs:', outputs, args);
    await this._rete.processCircuit(<string>node.data['circuitName']);

    // @TODO
    // 1. see how dynamic inputs will be passed to the engine for processing
    // 2. figure out way to provide output to outside of module
    // 3. make separate node component for circuit
  }
}
