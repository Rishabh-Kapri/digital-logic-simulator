import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { Connection, Engine, Input, Node, NodeEditor, Output } from 'rete';
import { Data, NodesData } from 'rete/types/core/data';
import { ConnectionView } from 'rete/types/view/connection';
import { AndGateComponent } from '../rete/components/and-gate-component';
import { CircuitModuleComponent } from '../rete/components/circuit-module-component';
import { NotGateComponent } from '../rete/components/not-gate-component';
import { OrGateComponent } from '../rete/components/or-gate-component';
import { SinkComponent } from '../rete/components/sink-component';
import { SourceComponent } from '../rete/components/source-component';
import { ioSocket } from '../rete/sockets/sockets';
import ConnectionPlugin from 'rete-connection-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import { CircuitModuleManagerService } from './circuit-module-manager.service';
import { testData } from '../shared/test-data';

@Injectable({
  providedIn: 'root',
})
export class ReteService {
  andGateComponent!: AndGateComponent;
  notGateComponent!: NotGateComponent;
  orGateComponent!: OrGateComponent;
  sourceComponent!: SourceComponent;
  sinkComponent!: SinkComponent;
  customCircuitComponent!: CircuitModuleComponent;

  editor!: NodeEditor;
  engine!: Engine;

  constructor(private _manager: CircuitModuleManagerService) {}

  initRete(container: HTMLElement): void {
    this.editor = new NodeEditor('node-editor@0.1.0', container);
    this.engine = new Engine('node-editor@0.1.0');

    this.editor.use(ConnectionPlugin);
    this.editor.use(AngularRenderPlugin);

    this.andGateComponent = new AndGateComponent(this);
    this.notGateComponent = new NotGateComponent(this);
    this.orGateComponent = new OrGateComponent(this);
    this.sourceComponent = new SourceComponent(this, this._manager);
    this.sinkComponent = new SinkComponent(this, this._manager);
    this.customCircuitComponent = new CircuitModuleComponent(this, this._manager);

    [
      this.andGateComponent,
      this.notGateComponent,
      this.orGateComponent,
      this.sourceComponent,
      this.sinkComponent,
      this.customCircuitComponent,
    ].map((c) => {
      this.editor.register(c);
      this.engine.register(c);
    });
    this._manager.engine = this.engine;
    this.addReteListeners();
    this.editor.view.resize();
    this.editor.trigger('process');
  }

  addReteListeners(): void {
    this.editor.on('componentregister', (val) => {
      // console.log(val.worker);
    });
    this.editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], (async (
      value: unknown
    ) => {
      if (this.editor.silent) {
        return;
      }
      await this.engine.abort();
      await this.engine.process(this.editor.toJSON());
    }) as any);

    this.engine.on('error', (err) => {
      console.log('Engine error:', err);
    });
  }

  async addSourceOnUI() {
    const node = await this.sourceComponent.createNode({ id: nanoid(4) });
    node.position = [40, 200];
    this.editor.addNode(node);
  }

  async addSinkOnUI() {
    const node = await this.sinkComponent.createNode({ id: nanoid(4) });
    node.position = [500, 200];
    this.editor.addNode(node);
  }

  async addAndGateOnUI() {
    const node = await this.andGateComponent.createNode({ id: nanoid(4) });
    node.position = [200, 200];
    this.editor.addNode(node);
  }

  async addNotGateOnUI() {
    const node = await this.notGateComponent.createNode({ id: nanoid(4) });
    node.position = [200, 200];
    this.editor.addNode(node);
  }

  async addOrGateOnUI() {
    const node = await this.orGateComponent.createNode({ id: nanoid(4) });
    node.position = [200, 200];
    this.editor.addNode(node);
  }

  async addCircuitModuleOnUI(circuitName: string) {
    const node = await this.customCircuitComponent.createNode({ circuitName });
    this.editor.addNode(node);
    return node;
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

  async packageCircuit() {
    await this.addSourceOnUI();
    await this.addSourceOnUI();
    await this.addSinkOnUI();
    try {
      const circuitName = 'AND_CUSTOM';
      const nodesData = <NodesData>testData[circuitName];
      this._manager.init(circuitName, {
        id: 'node-editor@0.1.0',
        nodes: nodesData,
      });
      const circuitNode = <Node>await this.addCircuitModuleOnUI(circuitName);

      for (let [id, nodeData] of Object.entries(nodesData)) {
        const nodeType = nodeData.name;
        switch (nodeType) {
          case 'Source': {
            // store this key
            const key = `${nodeData.name}-${nodeData.data['id']}`;
            circuitNode.addInput(new Input(key, '', ioSocket));
            console.log('Source node found', key);
            break;
          }
          case 'Sink': {
            const key = `${nodeData.name}-${nodeData.data['id']}`;
            circuitNode.addOutput(new Output(key, '', ioSocket));
            console.log('Sink node found', key);
            break;
          }
          case 'Custom': {
            console.log('Custom node found');
            const name = <string>nodeData.data['circuitName'];
            console.log(testData[name]);
            if (testData[name]) {
              this._manager.init(name, {
                id: 'node-editor@0.1.0',
                nodes: testData[name],
              });
            }
            break;
          }
        }
        console.log('ID: ', `${nodeData.name}-${nodeData.data['id']}`);
        for (let [inputKey, input] of Object.entries(nodeData.inputs)) {
          console.log('INPUTS:', inputKey, input.connections);
          for (let con of input.connections) {
            console.log('Input Con:', inputKey, con);
          }
        }
        for (let [outputKey, output] of Object.entries(nodeData.outputs)) {
          console.log('OUTPUTS:', outputKey, output.connections);
          for (let con of output.connections) {
            console.log('Output Con:', outputKey, con);
          }
        }
        console.log('\n');
      }

      console.log(this._manager);
      this.editor.trigger('process');
    } catch (err) {
      console.log(err);
    }
  }
}
