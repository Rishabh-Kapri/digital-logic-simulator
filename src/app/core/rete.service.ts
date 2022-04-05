import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { Engine, Input, Node, NodeEditor, Output } from 'rete';
import { Data } from 'rete/types/core/data';
import { AndGateComponent } from '../rete/components/and-gate-component';
import { CircuitModuleComponent } from '../rete/components/circuit-module-component';
import { NotGateComponent } from '../rete/components/not-gate-component';
import { OrGateComponent } from '../rete/components/or-gate-component';
import { SinkComponent } from '../rete/components/sink-component';
import { SourceComponent } from '../rete/components/source-component';
import { ioSocket } from '../rete/sockets/sockets';
import ConnectionPlugin from 'rete-connection-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
// @ts-ignore
import AreaPlugin from 'rete-area-plugin';
// @ts-ignore
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { Store } from '@ngxs/store';
import { CircuitModuleActions } from './store/actions/circuit.actions';

@Injectable({
  providedIn: 'root',
})
export class ReteService {
  editorState = {
    empty: true,
  };
  andGateComponent!: AndGateComponent;
  notGateComponent!: NotGateComponent;
  orGateComponent!: OrGateComponent;
  sourceComponent!: SourceComponent;
  sinkComponent!: SinkComponent;
  customCircuitComponent!: CircuitModuleComponent;

  editor!: NodeEditor;
  engine!: Engine;

  constructor(private store: Store) {}

  initRete(container: HTMLElement): void {
    this.editor = new NodeEditor('node-editor@0.1.0', container);
    this.engine = new Engine('node-editor@0.1.0');

    this.editor.use(ConnectionPlugin);
    this.editor.use(AngularRenderPlugin);
    this.setContextMenuPlugin();
    this.editor.use(AreaPlugin, {
      // translateExtent: { width: 100, height: 100 },
    });

    this.andGateComponent = new AndGateComponent(this.store);
    this.notGateComponent = new NotGateComponent(this.store);
    this.orGateComponent = new OrGateComponent(this.store);
    this.sourceComponent = new SourceComponent(this.store);
    this.sinkComponent = new SinkComponent(this.store);
    this.customCircuitComponent = new CircuitModuleComponent(this.store);

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
    this.addReteListeners();
    this.editor.view.resize();
    const { area } = this.editor.view;
    this.editor.trigger('process');
  }

  setContextMenuPlugin() {
    this.editor.use(ContextMenuPlugin, {
      searchBar: false, // true by default
      // searchKeep: title => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
      delay: 100,
      allocate(component: any) {
        if (component.name !== 'Custom') {
          return [];
        } else {
          return null;
        }
      },
      rename(component: any) {
        if (component.name === 'Source') {
          return 'Input';
        } else if (component.name === 'Sink') {
          return 'Output';
        } else {
          return component.name;
        }
      },
      items: {
        'Click me'() {
          console.log('Works!');
        },
      },
      nodeItems: {
        'Click me'(component: any) {
          console.log(component.node.id, component.node);
        },
        Delete: true, // don't show Delete item
        Clone: false, // or Clone item
      },
      // OR
      // nodeItems: (node: any) => {
      //   if (node.name === 'Add') {
      //     return {
      //       'Only for Add nodes'() => { console.log('Works for add node!') },
      //   };
      // }
      //   return {
      //   'Click me'() { console.log('Works for node!') }
      // }
    });
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
      const editorData = this.editor.toJSON();
      if (Object.keys(editorData.nodes).length === 0) {
        this.editorState.empty = true;
      } else {
        this.editorState.empty = false;
      }
      await this.engine.abort();
      await this.engine.process(editorData);
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
    const node = await this.customCircuitComponent.createNode({ circuitName, shownInEditor: true });
    this.editor.addNode(node);
    return node;
  }

  async packageCircuitFromEditor(circuitName: string = 'NAND') {
    try {
      const data = this.editor.toJSON();
      // const data = { id: 'node-editor@0.1.0', nodes: testData[circuitName] };
      if (Object.keys(data.nodes).length !== 0) {
        const emptyData = { id: 'node-editor@0.1.0', nodes: {} };
        // reset the editor to blank state
        await this.editor.fromJSON(emptyData);

        // @TODO
        // add check here for existing name
        this.store.dispatch(new CircuitModuleActions.Init(circuitName, data));
        await this.addCircuit(circuitName, data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async addExistingCustomCircuit(circuitName: string) {
    // @TODO
    // handle circuit not present
    const data = <Data>this.store.selectSnapshot((state) => state.circuit[circuitName].data);
    await this.addCircuit(circuitName, data);
  }

  private async addCircuit(circuitName: string, data: Data) {
    const circuitNode = <Node>await this.addCircuitModuleOnUI(circuitName);
    const nodesData = data.nodes;

    const customCircuits = [];
    for (let [id, nodeData] of Object.entries(nodesData)) {
      const nodeType = nodeData.name;
      switch (nodeType) {
        case 'Source': {
          const key = `${nodeData.name}-${nodeData.data['id']}`;
          circuitNode.addInput(new Input(key, key, ioSocket));
          break;
        }
        case 'Sink': {
          const key = `${nodeData.name}-${nodeData.data['id']}`;
          circuitNode.addOutput(new Output(key, key, ioSocket));
          break;
        }
        case 'Custom': {
          // since all the custom circuit data is parsed from localStorage by
          // ngxs we don't need to init anything here. We just need to check if
          // the data is not present in state
          // @TODO
          // 1. add comments
          // 2. handle custom circuit not present
          const name = <string>nodeData.data['circuitName'];
          customCircuits.push(name);
          break;
        }
      }
    }
    console.log(customCircuits);
    this.editor.trigger('process');
  }
}
