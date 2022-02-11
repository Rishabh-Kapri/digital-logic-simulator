import { Component, Node } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { CircuitModuleManagerService } from 'src/app/core/circuit-module-manager.service';
import { ReteService } from 'src/app/core/rete.service';
import { CircuitIO } from 'src/app/shared/interfaces/circuit-io.interface';
import { CustomCircuitControl } from '../controls/custom-circuit-control/custom-circuit.control';
import { CircuitModuleCustomNodeComponent } from '../nodes/circuit-module-custom-node/circuit-module-custom-node.component';

export class CircuitModuleComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  constructor(private _rete: ReteService, private _manager: CircuitModuleManagerService) {
    super('Custom');
    this.data.render = 'angular';
    this.data.component = CircuitModuleCustomNodeComponent;
  }

  async builder(node: Node): Promise<void> {
    const ctrl = new CustomCircuitControl(this.editor, 'Custom');
    node.addControl(ctrl);
    ctrl.setCircuitName(<string>node.data['circuitName']);
  }

  async worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, args: any): Promise<void> {
    console.log(node.data, inputs, outputs);
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
    // set the value received in the inputs of the circuit module to an object to be
    // used by internal gates
    this._manager.setInputValues(<string>node.data['circuitName'], <CircuitIO>inputs);

    // process the circuit module data
    await this._manager.triggerCircuitProcess(<string>node.data['circuitName']);

    // after process is finished, sink will have stored the output values in the object
    const processedOuts = this._manager.getOutputValues(<string>node.data['circuitName']);

    // loop through the processed outputs and set them to the output of the
    // circuit module to be used by the external sinks or gates
    for (let [key, val] of Object.entries(processedOuts)) {
      outputs[key] = val;
      if (currNode) {
        currNode.meta = { output: val };
        const nodeConnections = currNode.getConnections() ?? [];
        const connections = this.editor?.view.connections;
        this._rete.updateConnectionStroke(connections, nodeConnections);
      }
    }
  }
}
