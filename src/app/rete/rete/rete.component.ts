import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Engine, NodeEditor } from 'rete';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
// import ContextMenuPlugin from 'rete-context-menu-plugin';
// @ts-ignore
import ModulePlugin from 'rete-module-plugin';
import { AndGateComponent } from '../components/and-gate-component';
import { NotGateComponent } from '../components/not-gate-component';
import { SourceComponent } from '../components/source-component';
import { ReteService } from 'src/app/core/rete.service';
import { Data, NodesData } from 'rete/types/core/data';
import { SinkComponent } from '../components/sink-component';
import { OrGateComponent } from '../components/or-gate-component';
import { CircuitModuleComponent } from '../components/circuit-module-component';
// import { zoomAt } from 'rete-area-plugin';

@Component({
  selector: 'app-rete',
  templateUrl: './rete.component.html',
  styleUrls: ['./rete.component.css'],
})
export class ReteComponent implements AfterViewInit {
  @ViewChild('nodeEditor') el!: ElementRef;
  editor!: NodeEditor;
  engine!: Engine;
  data!: Data;
  modules = {};
  components!: any;

  andData = {
    // '1': {
    //   id: 1,
    //   data: {
    //     id: 0,
    //     'And-0': false,
    //   },
    //   inputs: {
    //     inputA: {
    //       connections: [
    //         {
    //           node: 4,
    //           output: 'output',
    //           data: {},
    //         },
    //       ],
    //     },
    //     inputB: {
    //       connections: [
    //         {
    //           node: 5,
    //           output: 'output',
    //           data: {},
    //         },
    //       ],
    //     },
    //   },
    //   outputs: {
    //     output: {
    //       connections: [
    //         {
    //           node: 6,
    //           input: 'input',
    //           data: {},
    //         },
    //       ],
    //     },
    //   },
    //   position: [213, 207],
    //   name: 'And',
    // },
    '3': {
      id: 3,
      data: {
        id: 0,
        'Not-0': true,
      },
      inputs: {
        input: {
          connections: [
            {
              node: 4,
              output: 'output',
              data: {},
            },
          ],
        },
      },
      outputs: {
        output: {
          connections: [
            {
              node: 6,
              input: 'input',
              data: {},
            },
          ],
        },
      },
      position: [225, 175],
      name: 'Not',
    },
    '4': {
      id: 4,
      data: {
        id: 0,
        'Source-0': false,
      },
      inputs: {},
      outputs: {
        output: {
          connections: [
            {
              node: 3,
              input: 'input',
              data: {},
            },
          ],
        },
      },
      position: [40, 200],
      name: 'Source',
    },
    // '5': {
    //   id: 5,
    //   data: {
    //     id: 1,
    //     'Source-1': false,
    //   },
    //   inputs: {},
    //   outputs: {
    //     output: {
    //       connections: [
    //         {
    //           node: 1,
    //           input: 'inputB',
    //           data: {},
    //         },
    //       ],
    //     },
    //   },
    //   position: [40, 250],
    //   name: 'Source',
    // },
    '6': {
      id: 6,
      data: {
        id: 0,
        'Sink-0': true,
      },
      inputs: {
        input: {
          connections: [
            {
              node: 3,
              output: 'output',
              data: {},
            },
          ],
        },
      },
      outputs: {},
      position: [500, 200],
      name: 'Sink',
    },
  } as NodesData;

  testData = {
    '3': {
      id: 3,
      data: {
        Not: true,
      },
      inputs: {
        input: {
          connections: [
            {
              node: 4,
              output: 'Source',
              data: {},
            },
          ],
        },
      },
      outputs: {
        Source: {
          connections: [
            {
              node: 6,
              input: 'input',
              data: {},
            },
          ],
        },
      },
      position: [221.5, 182],
      name: 'Not',
    },
    '4': {
      id: 4,
      data: {
        Source: false,
      },
      inputs: {},
      outputs: {
        Source: {
          connections: [
            {
              node: 3,
              input: 'input',
              data: {},
            },
          ],
        },
      },
      position: [40, 200],
      name: 'Source',
    },
    '6': {
      id: 6,
      data: {
        Sink: true,
      },
      inputs: {
        input: {
          connections: [
            {
              node: 3,
              output: 'Source',
              data: {},
            },
          ],
        },
      },
      outputs: {},
      position: [482, 210],
      name: 'Sink',
    },
  };

  constructor(public _rete: ReteService) {}

  async ngAfterViewInit() {
    const container = this.el.nativeElement;
    this.components = [
      new AndGateComponent(this._rete),
      new NotGateComponent(this._rete),
      new SourceComponent(this._rete),
      new SinkComponent(this._rete),
      new OrGateComponent(this._rete),
      new CircuitModuleComponent('test', this._rete),
    ];

    this.editor = new NodeEditor('node-editor@0.1.0', container);
    this.editor.use(ConnectionPlugin);
    this.editor.use(AngularRenderPlugin);

    // editor.use(ContextMenuPlugin);
    this.editor.on('componentregister', (val) => {
      console.log(val.worker);
    });

    this.engine = new Engine('node-editor@0.1.0');
    this.components.map((c: any) => {
      this.editor.register(c);
      this.engine.register(c);
    });
    this._rete.engine = this.engine;

    const andGate = await this.components[0].createNode({ id: 0 });
    const andGate2 = await this.components[0].createNode({ id: 1 });
    const notGate = await this.components[1].createNode({ id: 0 });
    const source1 = await this.components[2].createNode({ id: 0 });
    const source2 = await this.components[2].createNode({ id: 1 });
    const sink = await this.components[3].createNode({ id: 0 });
    const orGate = await this.components[4].createNode();

    source1.position = [40, 200];
    source2.position = [40, 250];
    andGate.position = [100, 200];
    andGate2.position = [200, 200];
    notGate.position = [300, 200];
    sink.position = [500, 200];
    this.editor.addNode(source1);
    // this.editor.addNode(source2);
    // this.editor.addNode(andGate);
    this.editor.addNode(sink);
    // editor.addNode(andGate2);
    // this.editor.addNode(notGate);
    // this.editor.addNode(orGate);

    // editor.connect(andGate.outputs.get('output') as Output, andGate2.inputs.get('inputA') as Input);
    // editor.connect(andGate.outputs.get('output') as Output, andGate2.inputs.get('inputB') as Input);
    // editor.connect(notGate.outputs.get('output') as Output, andGate2.inputs.get('inputB') as Input);

    // editor.on('renderconnection', ({ el, connection }) => {
    //   console.log('renderconnection:', connection.input, connection.output.node?.controls.get('not-gate'));
    //   const path = el.querySelector('path');
    //   const node = connection.output.node;
    //   const ctrl = <SourceControl>node?.controls.get('Source');
    //   if (ctrl) {
    //     const output = ctrl.props['sourceValue'] ?? false;
    //     if (output) {
    //       path?.setAttribute('style', 'stroke: #ff0038 !important;');
    //     }
    //   }
    // });

    this.editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], (async (
      value: unknown
    ) => {
      console.log(this.editor.silent);
      if (this.editor.silent) {
        return;
      }
      await this.engine.abort();
      await this.engine.process(this.editor.toJSON());
    }) as any);

    this.engine.on('error', (err) => {
      console.log('Engine error:', err);
    });
    this.editor.view.resize();
    this.editor.trigger('process');
    // zoomAt(editor);
  }

  saveData() {
    this.data = this.editor.toJSON();
    console.log(this.data);
  }

  async processJSON() {
    console.log('processing...');
    try {
      const value = await this.editor.fromJSON(this.data);
      console.log(value);
    } catch (err) {
      console.log(err);
    }
  }

  async packageCurrent() {
    const data = this.editor.toJSON();
    const emptyData = { id: 'node-editor@0.1.0', nodes: {} };
    // await this.editor.fromJSON(emptyData);
    console.log(data);
    const testData = { id: 'node-editor@0.1.0', nodes: this.andData } as Data;
    const circuitNode = await this.components[5].createNode();
    this.editor.addNode(circuitNode);
    await this._rete.packageCircuit(this.andData, this.engine, circuitNode);
    // await this.editor.fromJSON(testData);
    this.editor.trigger('process');
    // await this._rete.processEngine(this.andData);
  }
}
