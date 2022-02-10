import { Engine, Input, Output } from 'rete';
import { Data } from 'rete/types/core/data';
class CircuitModule {
  private _inputValues: { [key: string]: boolean };
  private _outputValues: { [key: string]: boolean };
  private _data!: Data;
  private inputSockMap = new Map();
  private outputSockMap = new Map();

  constructor(data: Data) {
    this._data = data;
    this._inputValues = {};
    this._outputValues = {};
  }

  get inputValues() {
    return this._inputValues;
  }

  get outputValues() {
    return this._outputValues;
  }

  get data() {
    return this._data;
  }

  getInputValue(key: string) {
    return this._inputValues[key];
  }

  getOutputValue(key: string) {
    return this._outputValues[key];
  }

  setInputValue(key: string, val: boolean) {
    this._inputValues[key] = val;
  }

  setOutputValue(key: string, val: boolean) {
    this._outputValues[key] = val;
  }

  setInputSock(key: string, socket: Input) {
    this.inputSockMap.set(key, socket);
  }

  setOutputSock(key: string, socket: Output) {
    this.outputSockMap.set(key, socket);
  }
}

export class CircuitModuleManager {
  private moduleMap: Map<string, CircuitModule> = new Map();
  private _engine!: Engine;

  constructor(name: string, data: Data) {
    if (this.moduleMap.has(name)) {
      // @TODO
      // handle this error in UI
      throw `Circuit with name ${name} already exists`;
    }
    this.moduleMap.set(name, new CircuitModule(data));
  }

  set engine(engine: Engine) {
    this._engine = engine;
  }

  // @TODO
  // see how connections happen between source and an input of gate
  // specifically check which input is connected to which source name wise
  setInputValue(circuitName: string, inputKey: string, val: boolean) {
    const module = this.moduleMap.get(circuitName);
    if (module) {
      module.setInputValue(inputKey, val);
    }
  }

  // @TODO
  // see how connections happen between output of gate and sink
  setOutputValue(circuitName: string, outputKey: string, val: boolean) {
    const module = this.moduleMap.get(circuitName);
    if (module) {
      module.setOutputValue(outputKey, val);
    }
  }

  async triggerCircuitProcess(circuitName: string) {
    const module = this.moduleMap.get(circuitName);
    if (module) {
      const inputs = module.inputValues;
      const outputs = module.outputValues;
      console.log(`${inputs} ${outputs}`);
      const args = { readWrite: true, circuitName };
      await this._engine.process(module.data, null, {}, { ...args });
    }
  }
}
