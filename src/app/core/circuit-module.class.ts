import { Input, Output } from 'rete';
import { Data } from 'rete/types/core/data';
import { CircuitIO } from '../shared/interfaces/circuit-io.interface';

export class CircuitModule {
  private _inputValues: CircuitIO;
  private _outputValues: CircuitIO<boolean>;
  private _data!: Data;
  private inputSockMap = new Map();
  private outputSockMap = new Map();

  constructor(data: Data) {
    this._data = data;
    this._inputValues = {};
    this._outputValues = {};
  }

  get data(): Data {
    return this._data;
  }

  get inputValues(): CircuitIO {
    return this._inputValues;
  }

  get outputValues(): CircuitIO<boolean> {
    return this._outputValues;
  }

  getInputValue(key: string): boolean[] {
    return this._inputValues[key];
  }

  getOutputValue(key: string): boolean {
    return this._outputValues[key];
  }

  setInputValues(data: CircuitIO): void {
    this._inputValues = data;
  }

  setOutputValues(data: CircuitIO<boolean>): void {
    this._outputValues = data;
  }

  setOutputValue(key: string, val: boolean) {
    this._outputValues[key] = val;
  }

  setInputSock(key: string, socket: Input): void {
    this.inputSockMap.set(key, socket);
  }

  setOutputSock(key: string, socket: Output): void {
    this.outputSockMap.set(key, socket);
  }
}
