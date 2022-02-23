import { Store } from '@ngxs/store';
import { Component, Node } from 'rete';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { AppActions } from 'src/app/core/store/actions/app.actions';
import { CircuitModuleActions } from 'src/app/core/store/actions/circuit.actions';
import { CircuitIO } from 'src/app/shared/interfaces/circuit-io.interface';
import { CustomCircuitControl } from '../controls/custom-circuit-control/custom-circuit.control';
import { CircuitModuleCustomNodeComponent } from '../nodes/circuit-module-custom-node/circuit-module-custom-node.component';

export class CircuitModuleComponent extends Component implements AngularComponent {
  override data!: AngularComponentData;
  constructor(private store: Store) {
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
    const currNode = <Node>this.editor?.nodes.find((n) => n.id === node.id);
    const circuitName = <string>node.data['circuitName'];
    // set the value received in the inputs of the circuit module to an object to be
    // used by internal gates
    this.store.dispatch(new CircuitModuleActions.SetInputs(circuitName, <CircuitIO>inputs));

    // process the circuit module data
    await this.store.dispatch(new CircuitModuleActions.ProcessData(circuitName)).toPromise();
    // after process is finished, sink will have stored the output values in the object
    const processedOuts =
      <CircuitIO<boolean>>this.store.selectSnapshot((state) => state.circuit[circuitName]?.outputValues) ?? {};
    if (node.data['shownInEditor']) {
      // console.log('processedOuts', processedOuts);
    }

    // loop through the processed outputs and set them to the output of the
    // circuit module to be used by the external sinks or gates
    // console.log('processedOuts:', processedOuts);
    for (let [key, val] of Object.entries(processedOuts)) {
      outputs[key] = val;
      if (currNode) {
        currNode.meta[key] = val;
        if (node.data['shownInEditor']) {
          const nodeConnections = currNode.getConnections() ?? [];
          const connections = this.editor?.view.connections;
          this.store.dispatch(new AppActions.UpdateConnectionStroke(connections, nodeConnections));
        }
      }
    }
  }
}
