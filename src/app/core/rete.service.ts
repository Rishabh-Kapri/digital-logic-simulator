import { Injectable } from '@angular/core';
import { Connection, Engine, Input, Output } from 'rete';
import { Data, NodesData } from 'rete/types/core/data';
import { ConnectionView } from 'rete/types/view/connection';
import { CircuitModuleComponent } from '../rete/components/circuit-module-component';
import { ioSocket } from '../rete/sockets/sockets';
import { CircuitModuleManager } from './circuit-module.class';

type CircuitName = string;

@Injectable({
  providedIn: 'root',
})
export class ReteService {
  private _engine!: Engine;
  circuitInstances: { [key: CircuitName]: CircuitModuleManager } = {};
  constructor() {}

  set engine(val: Engine) {
    this._engine = val;
  }

  updateConnectionStroke(connections: Map<Connection, ConnectionView> | undefined, nodeConnections: Connection[]) {
    if (connections) {
      for (let con of nodeConnections) {
        const conData = connections?.get(con);
        if (conData) {
          const { el } = conData;
          const path = el.querySelector('path');
          const output = conData.outputNode.node.meta['output'] ?? false;
          if (output) {
            path?.classList.add('source-true');
          } else {
            path?.classList.remove('source-true');
          }
        }
      }
    }
  }

  async packageCircuit(data: unknown, engine: Engine, circuitNode: any) {
    const nodesData = <NodesData>data;
    console.log(circuitNode);
    const inputs = new Map();
    const outputs = new Map();
    for (let [id, nodeData] of Object.entries(nodesData)) {
      const nodeType = nodeData.name;
      const key = `${nodeData.name}-${nodeData.data['id']}`;
      switch (nodeType) {
        case 'Source': {
          circuitNode.addInput(new Input(key, '', ioSocket));
          inputs.set(key, { socket: new Input(key, '', ioSocket) });
          // console.log('Source node found', key);
          break;
        }
        case 'Sink': {
          circuitNode.addOutput(new Output(key, '', ioSocket));
          outputs.set(key, { socket: new Output(key, '', ioSocket) });
          // console.log('Sink node found', key);
          break;
        }
        case 'Not': {
          // console.log('Not node found');
          break;
        }
      }
      // console.log('ID: ', `${nodeData.name}-${nodeData.data['id']}`);
      for (let [inputKey, input] of Object.entries(nodeData.inputs)) {
        // console.log('INPUTS:', inputKey, input.connections)
        for (let con of input.connections) {
          // console.log('Input Con:', inputKey, con);
        }
      }
      for (let [outputKey, output] of Object.entries(nodeData.outputs)) {
        // console.log('OUTPUTS:', outputKey, output.connections);
        for (let con of output.connections) {
          // console.log('Output Con:', outputKey, con);
        }
      }
      // console.log('\n');
    }
    console.log(inputs, outputs);
    // await engine?.process({ id: 'node-editor@0.1.0', nodes: nodesData as NodesData }, null, { silent: true });
  }

  async processCircuit(circuitName: string) {
    const circuitModule = this.circuitInstances[circuitName];
    if (circuitModule) {
      await circuitModule.triggerCircuitProcess(circuitName);
    }
  }

  setCircuitOutput(circuitName: string, outputKey: string, outputVal: boolean) {
    const circuitModule = this.circuitInstances[circuitName];
    if (circuitModule) {
      circuitModule.setOutputValue(circuitName, outputKey, outputVal);
    }
  }

  // @TODO
  // add method to set input values
}
