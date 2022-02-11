import { Injectable } from '@angular/core';
import { Engine } from 'rete';
import { Data } from 'rete/types/core/data';
import { CircuitIO } from '../shared/interfaces/circuit-io.interface';
import { CircuitModule } from './circuit-module.class';

/**
 * Manager for circuit modules
 * Stores the CircuitModule instance which contains the circuit NodesData
 * Also handles call to the engine to process the NodesData
 */
@Injectable({
  providedIn: 'root',
})
export class CircuitModuleManagerService {
  private moduleMap: Map<string, CircuitModule> = new Map();
  private _engine!: Engine;

  constructor() {}

  /**
   * Initialise a new ciruit module
   * @param {string} circuitName name of the circuit, should be unique
   * @param {Data} data the rete json data for the circuit, used for processing
   * @throws {string} error if the circuit already exists with same name
   */
  init(circuitName: string, data: Data) {
    if (this.moduleMap.has(circuitName)) {
      throw `Circuit with name ${circuitName} already exists`;
    }
    this.moduleMap.set(circuitName, new CircuitModule(data));
  }

  getOutputValues(circuitName: string): CircuitIO<boolean> {
    const module = this.moduleMap.get(circuitName);
    let values = {};
    if (module) {
      values = module.outputValues;
    }
    return values;
  }

  /**
   * Sets the engine in class instance
   * @param {Engine} engine
   */
  set engine(engine: Engine) {
    this._engine = engine;
  }

  setInputValues(circuitName: string, data: CircuitIO): void {
    const module = this.moduleMap.get(circuitName);
    if (module) {
      module.setInputValues(data);
    }
  }

  setOutputValue(circuitName: string, key: string, val: boolean): void {
    const module = this.moduleMap.get(circuitName);
    if (module) {
      module.setOutputValue(key, val);
    }
  }

  getInputValue(circuitName: string, inputKey: string): boolean {
    const module = this.moduleMap.get(circuitName);
    let value = false;
    if (module) {
      value = module.getInputValue(inputKey)?.[0] ?? false;
    }
    return value;
  }

  /**
   * Uses the rete engine to process the NodesData
   * @param {string} circuitName
   */
  async triggerCircuitProcess(circuitName: string) {
    const module = this.moduleMap.get(circuitName);
    if (module) {
      const inputs = module.inputValues;
      const outputs = module.outputValues;
      const args = { isInternal: true, circuitName };
      const engine = this._engine.clone();
      await engine.process(module.data, null, { ...args });
    }
  }
}
